import type { Metadata } from "next"

// page.tsx is a Client Component ("use client"), which can't export
// `metadata` itself -- this sibling Server Component layout supplies it.
export const metadata: Metadata = {
  title: "VaxSearch: Find Vaccine Providers Near You",
  description:
    "Search pharmacies, clinics, hospitals, and doctors offering vaccines near any U.S. city, ZIP code, or your current location.",
}

export default function VaxSearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
