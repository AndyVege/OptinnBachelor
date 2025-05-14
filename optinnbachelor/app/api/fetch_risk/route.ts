// app/api/fetch-risk/route.ts
import { NextResponse } from 'next/server'
import { dbGenerelt } from "@/db";
import { riskLevels } from '@/db/schema'
import { v4 as uuid } from 'uuid'

// Denne endpointen finnes hos Varsom: https://api.met.no/weatherapi/avalancheforecast/2.0/
const locations = [
  { name: 'Oslo', regionId: 101 },
  { name: 'Larvik', regionId: 102 },
  { name: 'Gjerdrum', regionId: 103 }
]

export async function GET() {
  const baseUrl = 'https://api01.varsom.no/snow/forecast/avalanche/v6.0.0/api/RegionSummary/';

  const entries = []

  for (const loc of locations) {
    const res = await fetch(`${baseUrl}${loc.regionId}`, {
      headers: {
        'User-Agent': 'dashboard-optinn/1.0'
      }
    })

    if (!res.ok) continue

    const data = await res.json()

    entries.push({
      id: uuid(),
      location: loc.name,
      riskType: 'snøskred',
      level: data.AvalancheDangerLevel,
      validFrom: new Date(data.ValidFrom),
      validTo: new Date(data.ValidTo)
    })
  }

  if (entries.length > 0) {
    await dbGenerelt.insert(riskLevels).values(entries)
  }

  return NextResponse.json({ inserted: entries.length })
}