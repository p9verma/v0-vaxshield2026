import type { Metadata } from "next"

// page.tsx is a Client Component ("use client"), which can't export
// `metadata` itself -- this sibling Server Component layout supplies it.
export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach the VaxShield team to ask a question, request a partnership, submit feedback, or support our vaccine education mission.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
