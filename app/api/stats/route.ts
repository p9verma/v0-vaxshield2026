import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

const FALLBACK = {
  people_reached: 14800,
  simulator_runs: 6200,
  resources_downloaded: 3400,
  schools_engaged: 28,
}

async function getSheetStats(): Promise<{ people_reached: number; schools_engaged: number }> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  if (!sheetId) return { people_reached: FALLBACK.people_reached, schools_engaged: FALLBACK.schools_engaged }

  const res = await fetch(
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) return { people_reached: FALLBACK.people_reached, schools_engaged: FALLBACK.schools_engaged }

  const csv = await res.text()
  const rows = csv.trim().split("\n").slice(1)
  const stats: Record<string, number> = {}
  for (const row of rows) {
    const [key, value] = row.split(",")
    const k = key?.trim().replace(/"/g, "")
    const v = parseInt(value?.trim().replace(/"/g, ""), 10)
    if (k && !isNaN(v)) stats[k] = v
  }

  return {
    people_reached: stats.people_reached ?? FALLBACK.people_reached,
    schools_engaged: stats.schools_engaged ?? FALLBACK.schools_engaged,
  }
}

export async function GET() {
  try {
    const [sheetStats, simulatorRuns, resourcesDownloaded] = await Promise.all([
      getSheetStats(),
      redis.get<number>("simulator_runs"),
      redis.get<number>("resources_downloaded"),
    ])

    return NextResponse.json({
      people_reached: sheetStats.people_reached,
      schools_engaged: sheetStats.schools_engaged,
      simulator_runs: simulatorRuns ?? FALLBACK.simulator_runs,
      resources_downloaded: resourcesDownloaded ?? FALLBACK.resources_downloaded,
    })
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
