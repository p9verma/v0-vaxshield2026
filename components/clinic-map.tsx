"use client"

import { useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon, type LatLngTuple } from "leaflet"
import type { ClinicLocation } from "@/lib/clinic-data"

const center: LatLngTuple = [42.28, -83.74]

interface ClinicMapProps {
  visibleClinics: ClinicLocation[]
}

export function ClinicMap({ visibleClinics }: ClinicMapProps) {
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
      center={center}
      zoom={9}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {visibleClinics.map((clinic) => (
        <Marker key={clinic.name} position={[clinic.lat, clinic.lng]} icon={iconRef.current!}>
          <Popup>
            <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
              <p style={{ fontWeight: 600, marginBottom: "4px" }}>{clinic.name}</p>
              {clinic.free && (
                <span style={{ display: "inline-block", background: "#dcfce7", color: "#15803d", fontSize: "11px", padding: "1px 6px", borderRadius: "4px", marginBottom: "4px" }}>
                  Free
                </span>
              )}
              <p style={{ color: "#4b5563" }}>{clinic.address}</p>
              <p style={{ color: "#4b5563" }}>{clinic.phone}</p>
              <p style={{ color: "#6b7280", fontSize: "11px", marginTop: "4px" }}>{clinic.hours}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
