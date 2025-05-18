// app/api/fetch-risk/route.ts
import { NextResponse } from 'next/server'
import { dbHelse } from '@/db'
import { riskLevels } from '@/db/schema'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const locations = [
    { name: 'Oslo', regionId: 301 },       // Region Østlandet
    { name: 'Larvik', regionId: 302 },     // Region Sørøstlandet
    { name: 'Gjerdrum', regionId: 301 },   // også Østlandet
  ]

  const results = []

  for (const loc of locations) {
    try {
      const res = await fetch(`https://api01.nve.no/snow/forecast/avalanche/v6.0.0/api/RegionSummary/${loc.regionId}`, {
        headers: {
          'User-Agent': 'optinn-dashboard/1.0'
        },
        cache: "no-store"
      })

      if (!res.ok) {
        console.warn(`Feil ved henting av data for ${loc.name}`)
        continue
      }

      const data = await res.json()

      results.push({
        id: uuidv4(),
        location: loc.name,
        riskType: 'snøskred',
        level: data.AvalancheDangerLevel,
        validFrom: new Date(data.ValidFrom),
        validTo: new Date(data.ValidTo)
      })
    } catch (e) {
      console.error(`Feil med ${loc.name}:`, e)
    }
  }

  if (results.length > 0) {
    await dbHelse.insert(riskLevels).values(results)
  }

  return NextResponse.json({ status: 'OK', inserted: results.length })
}