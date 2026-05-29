import { NextRequest, NextResponse } from "next/server"

const UA = "VaxShield/1.0 (vaxshieldteam@gmail.com)"

async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=us`
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "en" },
  })
  if (!res.ok) return null
  const data = await res.json()
  if (!data.length) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

async function fetchClinics(lat: number, lng: number) {
  const radius = 10000
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="pharmacy"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["healthcare"="centre"](around:${radius},${lat},${lng});
    );
    out body;
  `
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "text/plain", "User-Agent": UA },
    body: query,
  })
  if (!res.ok) throw new Error(`Overpass error: ${res.status}`)
  const data = await res.json()

  return data.elements
    .filter((el: { tags?: { name?: string }; lat?: number; lon?: number }) => el.tags?.name && el.lat && el.lon)
    .map((el: { id: number; tags: Record<string, string>; lat: number; lon: number }) => ({
      id: el.id,
      name: el.tags.name,
      address: [el.tags["addr:housenumber"], el.tags["addr:street"], el.tags["addr:city"]]
        .filter(Boolean)
        .join(" ") || "Address not listed",
      phone: el.tags.phone || el.tags["contact:phone"],
      lat: el.lat,
      lng: el.lon,
      type: el.tags.amenity || el.tags.healthcare || "clinic",
    }))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")
  const latParam = searchParams.get("lat")
  const lngParam = searchParams.get("lng")

  try {
    let lat: number
    let lng: number

    if (latParam && lngParam) {
      lat = parseFloat(latParam)
      lng = parseFloat(lngParam)
    } else if (q) {
      const coords = await geocode(q)
      if (!coords) return NextResponse.json({ error: "Location not found" }, { status: 404 })
      lat = coords.lat
      lng = coords.lng
    } else {
      return NextResponse.json({ error: "Missing query or coordinates" }, { status: 400 })
    }

    const clinics = await fetchClinics(lat, lng)
    return NextResponse.json({ lat, lng, clinics })
  } catch {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}
