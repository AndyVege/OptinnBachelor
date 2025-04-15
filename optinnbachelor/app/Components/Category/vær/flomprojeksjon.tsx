'use Client'
import React, { useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ClipLoader from 'react-spinners/ClipLoader';
import SelectMenu from '../../selectMenu'; // Bruker samme SelectMenu som i GenereltDashboard

type FlomData = {
  dato: string; // ISO-dato (f.eks. "2025-01-02")
  flomsannsynlighet: number; // verdi mellom 0 og 1
};

const FlomProjeksjon = () => {
  const [flomData, setFlomData] = useState<FlomData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [openDays, setOpenDays] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchFlomData = async () => {
      try {
        const res = await fetch('/api/flomprojeksjon');
        if (!res.ok) {
          throw new Error('Failed to fetch flom projection data');
        }
        const data = await res.json();
        setFlomData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlomData();
  }, []);

  // Beregn "i morgen" én gang
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }, []);

  // Filtrer data for valgt tidsperiode (fra i morgen til 'selectedDays' dager)
  const periodData = useMemo(() => {
    const periodEnd = new Date(tomorrow);
    periodEnd.setDate(tomorrow.getDate() + selectedDays);
    return flomData.filter((item) => {
      const d = new Date(item.dato);
      return d >= tomorrow && d < periodEnd;
    });
  }, [flomData, tomorrow, selectedDays]);

  // Bestem maksimum sannsynlighet i valgt periode for y-aksen
  const yDomainMax = useMemo(() => {
    const maxProb =
      periodData.length > 0 ? Math.max(...periodData.map((item) => item.flomsannsynlighet)) : 0;
    return maxProb ? maxProb * 1.1 : 0.1;
  }, [periodData]);

  // Topp 10 flomdager i valgt periode (kun dager med sannsynlighet over 0)
  const top10Period = useMemo(() => {
    return [...periodData]
      .filter((item) => item.flomsannsynlighet > 0)
      .sort((a, b) => b.flomsannsynlighet - a.flomsannsynlighet)
      .slice(0, 10)
      .sort((a, b) => new Date(a.dato).getTime() - new Date(b.dato).getTime());
  }, [periodData]);

  // Topp 10 flomdager for hele tilgjengelige datasettet
  const top10All = useMemo(() => {
    return [...flomData]
      .sort((a, b) => b.flomsannsynlighet - a.flomsannsynlighet)
      .slice(0, 10)
      .sort((a, b) => new Date(a.dato).getTime() - new Date(b.dato).getTime());
  }, [flomData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#1E3528" />
      </div>
    );
  }

  return (
    // Ytre wrapper – starter uten ekstra sidepadding slik at den justeres med de over
    <div className="py-5">
      <div className="max-w-4xl">
        <div className="bg-white rounded-[30px] shadow-md p-5">
          {/* Overskrift med samme stil som Population */}
          <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-4">
            Flomprojeksjon
          </h2>

          {/* Flex-container med label og nedtrekksmeny for tidsperiode */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-60 mx-auto mb-4">
            <span className="font-bold self-center">Velg tidsperiode:</span>
            <SelectMenu
              options={["30 dager","90 dager", "180 dager", "360 dager"]}
              open={openDays}
              setOpen={setOpenDays}
              selected={selectedDays + " dager"}
              setSelected={(value: string | number) => setSelectedDays(parseInt(value.toString(), 10))}
            />
          </div>

          {/* Area Chart for valgt tidsperiode */}
          <div className="mb-5">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={periodData}>
                <XAxis
                  dataKey="dato"
                  tickFormatter={(tick) =>
                    new Date(tick).toLocaleDateString('no-NO', {
                      day: '2-digit',
                      month: 'short'
                    })
                  }
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, yDomainMax]}
                  tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString('no-NO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="flomsannsynlighet"
                  stroke="#1E3528"
                  fill="#1E3528"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Topp 10 flomdager – Valgt periode */}
          <div className="mb-5 border p-4 rounded-[30px]">
            <h3 className="text-center text-2xl font-bold mb-3">
              Topp 10 flomdager – Valgt periode
            </h3>
            {top10Period.length > 0 ? (
              top10Period.map((item) => (
                <p key={item.dato} className="text-center">
                  {new Date(item.dato).toLocaleDateString('no-NO')}: {(item.flomsannsynlighet * 100).toFixed(1)}%
                </p>
              ))
            ) : (
              <p className="text-center">
                Ingen flomdager med sannsynlighet over 0 i valgt periode.
              </p>
            )}
          </div>

          {/* Utvidbar seksjon for Topp 10 – Hele tidsperioden */}
          <div className="border p-4 rounded-[30px]">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <h3 className="text-center text-2xl font-bold">
                Topp 10 flomdager
              </h3>
              <button className="text-sm text-blue-600">
                {expanded ? 'Skjul' : 'Vis mer'}
              </button>
            </div>
            {expanded && (
              <div className="mt-3">
                <h4 className="text-center font-bold mb-2">Hele tidsperioden</h4>
                {top10All.length > 0 ? (
                  top10All.map((item) => (
                    <p key={item.dato} className="text-center">
                      {new Date(item.dato).toLocaleDateString('no-NO')}: {(item.flomsannsynlighet * 100).toFixed(1)}%
                    </p>
                  ))
                ) : (
                  <p className="text-center">
                    Ingen flomdager funnet for hele tidsperioden.
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FlomProjeksjon;
