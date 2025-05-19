// app/api/risk-levels/route.ts
import { dbGenerelt } from '@/db'
import { riskLevels } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await dbGenerelt
    .select()
    .from(riskLevels)
    .orderBy(desc(riskLevels.validFrom))
    .limit(10)

  return NextResponse.json(data)
}