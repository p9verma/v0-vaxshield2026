import type { Metadata } from "next"

// page.tsx is a Client Component ("use client"), which can't export
// `metadata` itself -- this sibling Server Component layout supplies it.
export const metadata: Metadata = {
  title: "For Organizations",
  description:
    "Partner with VaxShield to bring vaccine education lesson plans, classroom kits, and community workshops to your school, clinic, or nonprofit.",
}

export default function OrganizationsLayout({ children }: { children: React.ReactNode }) {
  return children
}
