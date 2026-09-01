"use client"

import { useRef, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Icon, latLngBounds, type LatLngTuple } from "leaflet"
import { PROVIDER_LABELS, type FoundClinic } from "@/lib/vaxsearch/types"

const DEFAULT_CENTER: LatLngTuple = [39.5, -98.35]
const DEFAULT_ZOOM = 4

/** Fallback zoom by search radius, used when there are too few markers to fit. */
function zoomForRadius(radiusMeters?: number): number {
  if (!radiusMeters) return 12
  if (radiusMeters >= 40_000) return 10
  if (radiusMeters >= 25_000) return 11
  return 12
}

function RecenterMap({
  center,
  clinics,
  radiusMeters,
}: {
  center: { lat: number; lng: number } | null
  clinics: FoundClinic[]
  radiusMeters?: number
}) {
  const map = useMap()

  useEffect(() => {
    if (!center) return

    // Fitting the actual markers beats a fixed zoom: at a widened 40km radius a
    // hardcoded zoom leaves most pins off-screen, which itself reads as
    // "it didn't find anything".
    if (clinics.length >= 2) {
      const bounds = latLngBounds(clinics.map((c) => [c.lat, c.lng] as LatLngTuple))
      bounds.extend([center.lat, center.lng])
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 })
      return
    }
    map.setView([center.lat, center.lng], zoomForRadius(radiusMeters))
  }, [center, clinics, radiusMeters, map])

  return null
}

interface ClinicMapProps {
  visibleClinics: FoundClinic[]
  center: { lat: number; lng: number } | null
  radiusMeters?: number
}

export function ClinicMap({ visibleClinics, center, radiusMeters }: ClinicMapProps) {
  const iconRef = useRef<Icon | null>(null)
  if (!iconRef.current) {
    iconRef.current = new Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })
  }

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap center={center} clinics={visibleClinics} radiusMeters={radiusMeters} />
      {visibleClinics.map((clinic) => (
        <Marker key={clinic.id} position={[clinic.lat, clinic.lng]} icon={iconRef.current!}>
          <Popup>
            <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
              <p style={{ fontWeight: 600, marginBottom: "4px" }}>{clinic.name}</p>
              <p style={{ color: "#4b5563" }}>{PROVIDER_LABELS[clinic.type]}</p>
              <p style={{ color: "#4b5563" }}>{clinic.address}</p>
              {clinic.phone && <p style={{ color: "#4b5563" }}>{clinic.phone}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
