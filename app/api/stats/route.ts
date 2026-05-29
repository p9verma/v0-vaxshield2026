import { NextResponse } from "next/server"

const FALLBACK = {
  people_reached: 14800,
  simulator_runs: 6200,
  resources_downloaded: 3400,
  schools_engaged: 28,
}

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEET_ID
  if (!sheetId) return NextResponse.json(FALLBACK)

  try {
    const res = await fetch(
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return NextResponse.json(FALLBACK)

    const csv = await res.text()
    const rows = csv.trim().split("\n").slice(1) // skip header row

    const stats: Record<string, number> = { ...FALLBACK }
    for (const row of rows) {
      const [key, value] = row.split(",")
      const k = key?.trim().replace(/"/g, "")
      const v = parseInt(value?.trim().replace(/"/g, ""), 10)
      if (k && !isNaN(v) && k in FALLBACK) stats[k] = v
    }

    return NextResponse.json(stats)
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
