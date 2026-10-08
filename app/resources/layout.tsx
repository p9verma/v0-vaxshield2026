import type { Metadata } from "next"

// page.tsx is a Client Component ("use client"), which can't export
// `metadata` itself -- this sibling Server Component layout supplies it.
export const metadata: Metadata = {
  title: "Free Vaccine Education Resources",
  description:
    "Download VaxShield's free worksheets, lesson plans, and classroom materials for teaching vaccine science and herd immunity.",
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children
}
