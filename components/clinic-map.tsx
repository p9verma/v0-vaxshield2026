"use client"

import { useRef, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Icon, type LatLngTuple } from "leaflet"
import type { FoundClinic } from "@/app/vaxsearch/page"

const DEFAULT_CENTER: LatLngTuple = [39.5, -98.35]
const DEFAULT_ZOOM = 4

function RecenterMap({ center }: { center: { lat: number; lng: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.setView([center.lat, center.lng], 12)
  }, [center, map])
  return null
}

interface ClinicMapProps {
  visibleClinics: FoundClinic[]
  center: { lat: number; lng: number } | null
}

export function ClinicMap({ visibleClinics, center }: ClinicMapProps) {
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
      <RecenterMap center={center} />
      {visibleClinics.map((clinic) => (
        <Marker key={clinic.id} position={[clinic.lat, clinic.lng]} icon={iconRef.current!}>
          <Popup>
            <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
              <p style={{ fontWeight: 600, marginBottom: "4px" }}>{clinic.name}</p>
              <p style={{ color: "#4b5563", textTransform: "capitalize" }}>{clinic.type}</p>
              <p style={{ color: "#4b5563" }}>{clinic.address}</p>
              {clinic.phone && <p style={{ color: "#4b5563" }}>{clinic.phone}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
