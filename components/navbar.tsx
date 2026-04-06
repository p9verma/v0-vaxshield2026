"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "VaxSearch", href: "/vaxsearch" },
  { label: "Resources", href: "/resources" },
  { label: "Impact", href: "/impact" },
  { label: "Organizations", href: "/organizations" },
  { label: "About", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-blue-950 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Shield className="h-7 w-7 text-sky-400" aria-hidden="true" />
            <span>
              Vax<span className="text-sky-400">Shield</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-sky-400",
                  pathname === link.href ? "text-sky-400" : "text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link href="/contact">Contact</Link>
            </Button>
            <Button asChild size="sm" className="bg-sky-400 text-blue-950 hover:bg-sky-300">
              <Link href="/#donate">Donate</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-white hover:text-sky-400"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-blue-950 border-t border-white/10 px-4 pb-4 pt-2 flex flex-col gap-3" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "py-2 text-sm font-medium transition-colors hover:text-sky-400",
                pathname === link.href ? "text-sky-400" : "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Button asChild size="sm" variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            </Button>
            <Button asChild size="sm" className="flex-1 bg-sky-400 text-blue-950 hover:bg-sky-300">
              <Link href="/#donate" onClick={() => setOpen(false)}>Donate</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
