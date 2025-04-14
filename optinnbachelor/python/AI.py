import os
import requests
import pandas as pd
import numpy as np
import base64
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ================================================
# Konfigurasjon: Hent API-nøkler og stasjons-IDer
# ================================================
CLIENT_ID = os.getenv("FROST_CLIENT_ID", "c95efd44-7968-4b65-8ded-38ddb3fbc712")
CLIENT_SECRET = os.getenv("FROST_CLIENT_SECRET", "a0c86cfd-e14e-4f41-9626-0c7814139967")
STATION_ID1 = "SN18700"  # Blindern stasjon i Oslo
STATION_ID = os.getenv("FROST_STATION_ID", "SN50540")
START_DATE = "2010-01-01"

# Hent dagens og gårsdagens dato (gårdagen gir full dag)
TODAY = datetime.now().strftime("%Y-%m-%d")
YESTERDAY = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

# Liste over kjente flomdager i Oslo (brukes til å merke historiske hendelser)
FLOMDAGER_OSLO = [
    "2015-08-05", "2015-09-02", "2016-08-06", "2017-08-09",
    "2019-06-26", "2019-08-03", "2019-08-04",
    "2020-10-27", "2022-08-15", "2022-08-16",
    "2023-08-07", "2023-08-08", "2024-05-27"
]

# ================================================
# Funksjon: Hent værdata fra Frost API
# ================================================
def hent_værdata():
    """
    Henter daglige temperaturdata fra Frost API og pivotter dataene.
    """
    url = "https://frost.met.no/observations/v0.jsonld"
    params = {
        "sources": STATION_ID,
        "elements": "mean(air_temperature P1D)",
        "referencetime": f"{START_DATE}/{YESTERDAY}",
        "timeresolutions": "P1D",
        "fields": "referenceTime,elementId,value"
    }
    # Kod autentiseringsinformasjon med base64
    credentials = f"{CLIENT_ID}:{CLIENT_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")
    headers = {"Authorization": f"Basic {encoded_credentials}"}

    r = requests.get(url, headers=headers, params=params)
    r.raise_for_status()
    json_response = r.json()
    if "data" not in json_response:
        raise ValueError("Ingen data funnet i værresponsen fra FROST.")

    records = []
    # Iterer over data og samle observasjoner
    for entry in json_response["data"]:
        dato = entry["referenceTime"][:10]  # Ekstraher dato (første 10 tegn)
        for obs in entry.get("observations", []):
            records.append({
                "dato": dato,
                "elementId": obs["elementId"],
                "value": obs["value"]
            })

    df_raw = pd.DataFrame(records)
    # Pivotter data slik at hver observasjonstype blir en kolonne
    df_pivot = df_raw.pivot_table(index="dato", columns="elementId", values="value", aggfunc="mean").reset_index()

    # Hvis temperaturdata ikke finnes, sett kolonnen med NaN
    if "mean(air_temperature P1D)" not in df_pivot.columns:
        df_pivot["mean(air_temperature P1D)"] = np.nan

    return df_pivot

# ================================================
# Funksjon: Hent nedbørsdata fra Frost API
# ================================================
def hent_nedbør(startdato="2010-01-01", sluttdato=None, api_nokkel=os.getenv("FROST_CLIENT_ID", "c95efd44-7968-4b65-8ded-38ddb3fbc712")):
    """
    Henter daglige nedbørsdata fra Frost API.
    """
    if sluttdato is None:
        sluttdato = YESTERDAY
    endpoint = "https://frost.met.no/observations/v0.jsonld"
    params = {
        "sources": STATION_ID1,
        "elements": "sum(precipitation_amount P1D)",
        "referencetime": f"{startdato}/{sluttdato}",
    }
    response = requests.get(endpoint, params=params, auth=(api_nokkel, ""))
    response.raise_for_status()
    data = response.json().get("data", [])
    nedbør_liste = []
    for entry in data:
        tidspunkt = entry["referenceTime"][:10]
        nedbør = entry.get("observations", [{}])[0].get("value", 0)
        nedbør_liste.append({"dato": tidspunkt, "nedbør": nedbør})
    df = pd.DataFrame(nedbør_liste)
    df["dato"] = pd.to_datetime(df["dato"])
    df = df.sort_values("dato").reset_index(drop=True)
    return df

# ================================================
# Funksjon: Hent vannføringsdata fra NVE API
# ================================================
def hent_vannføringsdata():
    """
    Henter daglig vannføringsdata fra NVE API.
    """
    endpoint = "https://hydapi.nve.no/api/v1/Observations"
    api_key = os.getenv("NVE_API_KEY", "fy1cnW/TSk+y1G+Y3G/yTw==")
    station_id = "1.200.0"
    headers = {'accept': 'application/json', 'X-API-Key': api_key}
    end_date_iso = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%dT00:00:00Z")
    reference_time = f"{START_DATE}T00:00:00Z/{end_date_iso}"
    params = {
        'StationId': station_id,
        'Parameter': "1001",
        'ResolutionTime': '1440',
        'ReferenceTime': reference_time
    }
    response = requests.get(endpoint, headers=headers, params=params)
    response.raise_for_status()
    data = response.json().get("data", [])
    if not data or not data[0].get("observations"):
        return pd.DataFrame(columns=["dato", "vannføring"])
    observations = data[0]["observations"]
    df_vannfør = pd.DataFrame(observations)
    df_vannfør["dato"] = pd.to_datetime(df_vannfør["time"]).dt.strftime("%Y-%m-%d")
    df_vannfør = df_vannfør.rename(columns={"value": "vannføring"})
    return df_vannfør[["dato", "vannføring"]]

# ================================================
# Funksjon: Hent historiske klimadata fra NASA
# ================================================
def hent_historiske_klimadata():
    """
    Henter historiske årlige klimadata (temperatur og nedbør) fra NASA og estimerer lineære trender.
    """
    url = "https://power.larc.nasa.gov/api/temporal/annual/point"
    params = {
        "parameters": "T2M,PRECTOTCORR",
        "community": "RE",
        "longitude": "10.75",
        "latitude": "59.91",
        "start": "1980",
        "end": "2020",
        "format": "JSON"
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    years, temps, precs = [], [], []
    for year_str, value in data["properties"]["parameter"]["T2M"].items():
        years.append(int(year_str))
        temps.append(float(value))
    for year_str, value in data["properties"]["parameter"]["PRECTOTCORR"].items():
        precs.append(float(value))
    years = np.array(years)
    temps = np.array(temps)
    precs = np.array(precs)
    # Beregn lineær trend med polyfit
    slope_temp, _ = np.polyfit(years, temps, 1)
    slope_prec, _ = np.polyfit(years, precs, 1)
    return slope_temp, slope_prec

# ================================================
# Funksjon: Beregn flomrisiko ved sammenslåing av data
# ================================================
def beregn_flomrisiko(df_vær, df_vannfør):
    """
    Slår sammen værdata og vannføringsdata,
    normaliserer de sentrale variablene og beregner en samlet risikoscore.
    """
    df_vær["dato"] = pd.to_datetime(df_vær["dato"])
    df_vannfør["dato"] = pd.to_datetime(df_vannfør["dato"])
    df_merged = pd.merge(df_vær, df_vannfør, on="dato", how="left")

    # Fyll manglende verdier
    df_merged["sum(precipitation P1D)"] = df_merged["sum(precipitation P1D)"].fillna(0)
    df_merged["mean(air_temperature P1D)"] = df_merged["mean(air_temperature P1D)"].fillna(
        df_merged["mean(air_temperature P1D)"].mean()
    )
    df_merged["vannføring"] = df_merged["vannføring"].fillna(0)

    # Under vintermåneder: om temperaturen er under 0, settes nedbør til 0 (snøforhold)
    vinter_mask = df_merged["dato"].dt.month.isin([12, 1, 2])
    is_frost = df_merged["mean(air_temperature P1D)"] < 0
    df_merged.loc[vinter_mask & is_frost, "sum(precipitation P1D)"] = 0

    # Legg til sesongvariabel: lav risiko i månedene 4-7, ellers høy risiko
    df_merged["month"] = df_merged["dato"].dt.month
    df_merged["high_risk_season"] = df_merged["month"].apply(lambda m: 0 if m in [4, 5, 6, 7] else 1)

    # Normalisering av variablene med z-score
    for kolonne in ["sum(precipitation P1D)", "mean(air_temperature P1D)", "vannføring"]:
        mean_val = df_merged[kolonne].mean()
        std_val = df_merged[kolonne].std() if df_merged[kolonne].std() > 0 else 1e-6
        z_kol = "z_" + kolonne
        df_merged[z_kol] = (df_merged[kolonne] - mean_val) / std_val

    # Kombiner z-scores til en samlet risikoscore
    df_merged["z_sum"] = (
        df_merged["z_sum(precipitation P1D)"] +
        df_merged["z_mean(air_temperature P1D)"] +
        df_merged["z_vannføring"]
    )

    # Definer flomrisiko basert på terskler for z-summen
    conditions = [
        (df_merged["z_sum"] < 0),
        (df_merged["z_sum"] < 2),
        (df_merged["z_sum"] >= 2),
    ]
    choices = [0, 1, 2]
    df_merged["flomrisiko"] = np.select(conditions, choices, default=1)

    return df_merged

# ================================================
# Funksjon: Legg til historisk markering for flomdager
# ================================================
def legg_til_flomdager(df, flomdager):
    """
    Legger til en kolonne som markerer om dagen er en kjent flomdag.
    """
    df["faktisk_flom"] = df["dato"].isin(flomdager).astype(int)
    return df

# ================================================
# Funksjon: Tren flommodell basert på historiske data
# ================================================
def tren_flommodell(df, terskel=0.5):
    """
    Trener en Random Forest-modell for å klassifisere flomhendelser.
    Inkluderer den nye featuren for 3-dagers akkumulerte nedbør.
    """
    # Sørg for at nødvendige verdier er satt
    df["sum(precipitation P1D)"] = df["sum(precipitation P1D)"].fillna(0)
    df["mean(air_temperature P1D)"] = df["mean(air_temperature P1D)"].fillna(
        df["mean(air_temperature P1D)"].mean()
    )
    df["vannføring"] = df["vannføring"].fillna(0)
    
    # Fjern rader uten flommerking
    df = df.dropna(subset=["faktisk_flom"])
    
    if len(df) < 10:
        raise ValueError("❌ For få gyldige rader til trening.")

    print(f"🧪 Antall rader for trening: {len(df)}")
    
    # Definer input features, inkludert ny 3-dagers nedbørsfeature
    features = [
        "sum(precipitation P1D)",
        "nedbør_3d_sum",
        "mean(air_temperature P1D)",
        "vannføring",
        "high_risk_season"
    ]
    X = df[features]
    y = df["faktisk_flom"]
    
    # Del datasettet i trenings- og testsett med bevaring av klassefordelingen
    X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.3, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced")
    model.fit(X_train, y_train)

    # Forutsi sannsynlighet og anvend terskelverdi for klassifisering
    y_prob = model.predict_proba(X_test)[:, 1]
    y_pred = (y_prob > terskel).astype(int)

    print("📊 Evaluering mot faktiske flomhendelser:")
    print(classification_report(y_test, y_pred))

    return model

# ================================================
# Funksjon: Projiser fremtidig flomrisiko
# ================================================
def projiser_flom_fremover(model, df_historisk, antall_dager=3650):
    """
    Simulerer fremtidige værdata og benytter den trente modellen for å beregne flomsannsynlighet.
    Inkluderer simulering av den 3-dagers akkumulerte nedbørsmengden.
    """
    # Beregn historiske statistikker for variablene
    precip_mean = df_historisk["sum(precipitation P1D)"].fillna(0).mean()
    precip_std = df_historisk["sum(precipitation P1D)"].fillna(0).std()
    temp_mean = df_historisk["mean(air_temperature P1D)"].mean()
    temp_std = df_historisk["mean(air_temperature P1D)"].std()
    vannføring_mean = df_historisk["vannføring"].fillna(0).mean()
    vannføring_std = df_historisk["vannføring"].fillna(0).std()

    # Hent klimadata for å estimere lineær trend
    try:
        slope_temp, slope_prec = hent_historiske_klimadata()
        print(f"🔥 Klimaendrings-trend: Temperatur {slope_temp:.4f} °C/år, Nedbør {slope_prec:.4f} mm/d/år")
    except Exception as e:
        print(f"Feil ved henting av klimadata: {e}")
        slope_temp, slope_prec = 0.0, 0.0

    # Generer fremtidige datoer
    fremtidige_datoer = pd.date_range(start="2025-01-01", periods=antall_dager)
    
    # Lag lineære trender basert på historiske gjennomsnittsverdier
    trend_precip = np.linspace(precip_mean, precip_mean * 2.0, antall_dager)
    trend_temp = np.linspace(temp_mean, temp_mean + 4.0, antall_dager)
    trend_vannføring = np.linspace(vannføring_mean, vannføring_mean * 2.0, antall_dager)
    
    np.random.seed(42)
    noise_factor = 0.2  # Juster støyens størrelse om nødvendig
    noise_precip = np.random.normal(0, precip_std, antall_dager) * noise_factor
    noise_temp   = np.random.normal(0, temp_std, antall_dager) * noise_factor
    noise_vannføring = np.random.normal(0, vannføring_std, antall_dager) * noise_factor

    # Kalkuler klimaoffset basert på antall år etter 2020
    years_after_2020 = np.array([date.year - 2020 for date in fremtidige_datoer])
    klima_offset_temp = years_after_2020 * slope_temp
    klima_offset_prec = years_after_2020 * slope_prec

    # Beregn fremtidige verdier for variablene med trend, offset og støy
    future_precip = np.clip(trend_precip + noise_precip + klima_offset_prec, 0, None)
    future_temp   = trend_temp + noise_temp + klima_offset_temp
    future_vannføring = np.clip(trend_vannføring + noise_vannføring, 0, None)

    # Bygg DataFrame med de simulerte fremtidsverdiene
    fremtidig_data = pd.DataFrame({
        "sum(precipitation P1D)": future_precip,
        "mean(air_temperature P1D)": future_temp,
        "vannføring": future_vannføring
    })
    
    # Legg til sesongvariabel basert på måned
    fremtidig_data["month"] = fremtidige_datoer.month
    fremtidig_data["high_risk_season"] = fremtidig_data["month"].apply(lambda m: 0 if m in [4, 5, 6, 7] else 1)
    fremtidig_data.drop("month", axis=1, inplace=True)
    
    # Legg til den 3-dagers akkumulerte nedbørsmengden for fremtidige data
    fremtidig_data["nedbør_3d_sum"] = fremtidig_data["sum(precipitation P1D)"].rolling(window=3, min_periods=1).sum()

    # Forutsi sannsynligheten for flom ved bruk av alle featurene
    features = [
        "sum(precipitation P1D)",
        "nedbør_3d_sum",
        "mean(air_temperature P1D)",
        "vannføring",
        "high_risk_season"
    ]
    sannsynligheter = model.predict_proba(fremtidig_data[features])[:, 1]

    # Finn de 10 dagene med høyest sannsynlighet for flom
    topp = np.argsort(sannsynligheter)[-10:][::-1]
    print("\n🔮 Topp 10 projiserte flomdager:")
    for i in topp:
        print(f"{fremtidige_datoer[i].date()}: Flomsannsynlighet: {sannsynligheter[i]:.2%}")

    df_fremtid = pd.DataFrame({
        "dato": fremtidige_datoer,
        "flomsannsynlighet": sannsynligheter
    })
    return df_fremtid

# ================================================
# Hovedprogram: Datahenting, Modelltrening og Projeksjon
# ================================================
if __name__ == "__main__":
    try:
        # Hent værdata
        værdata = hent_værdata()
        print("✅ Værdata hentet")
    except Exception as e:
        print(f"Kunne ikke hente værdata: {e}")
        exit(1)

    # Hent nedbørsdata
    nedbørdata = hent_nedbør()
    print("✅ Nedbørsdata hentet")

    # Gjør om datoene til datetime og merge datasett
    værdata["dato"] = pd.to_datetime(værdata["dato"])
    nedbørdata["dato"] = pd.to_datetime(nedbørdata["dato"])
    værdata = pd.merge(værdata, nedbørdata, on="dato", how="left")
    
    # Kopier nedbørsdata til kolonnen som benyttes for flomrisikovurdering og slett opprinnelig kolonne
    værdata["sum(precipitation P1D)"] = værdata["nedbør"]
    værdata = værdata.drop(columns=["nedbør"])
    
    # Sorter etter dato og legg til 3-dagers rullerende sum for nedbør
    værdata = værdata.sort_values("dato").reset_index(drop=True)
    værdata["nedbør_3d_sum"] = værdata["sum(precipitation P1D)"].rolling(window=3, min_periods=1).sum()

    # Hent vannføringsdata
    vannføringsdata = hent_vannføringsdata()
    print("✅ Vannføringsdata hentet")

    # Beregn flomrisiko basert på sammenslåtte data og legg til historiske flommarkeringer
    df_flom = beregn_flomrisiko(værdata, vannføringsdata)
    df_flom = legg_til_flomdager(df_flom, FLOMDAGER_OSLO)

    print("\n📆 Historiske flomdager og vurdering:")
    print(df_flom[df_flom["faktisk_flom"] == 1][["dato", "sum(precipitation P1D)", "mean(air_temperature P1D)", "vannføring", "flomrisiko"]])

    # Tren modellen og inkluder den nye featuren i treningssettet
    modell = tren_flommodell(df_flom, terskel=0.5)
    fremtidig = projiser_flom_fremover(modell, df_flom)
    
    # Lagre projeksjonsdata til CSV i en spesifisert katalog
    output_dir = os.path.join(os.getcwd(), "..", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "latest_projisert_flom.csv")
    fremtidig.to_csv(output_path, index=False)
    print(f"\n💾 Prosjeksjonsdata lagret som '{output_path}'")
