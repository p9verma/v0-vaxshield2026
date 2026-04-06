import Link from "next/link"
import { Shield, Mail, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[--navy] text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Shield className="h-6 w-6 text-[--sky]" aria-hidden="true" />
              Vax<span className="text-[--sky]">Shield</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              Reducing vaccine misinformation through education, interactive tools, and community outreach.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Twitter" className="hover:text-[--sky] transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-[--sky] transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-[--sky] transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-[--sky] transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/vaxsearch" className="hover:text-[--sky] transition-colors">VaxSearch</Link></li>
              <li><Link href="/#simulator" className="hover:text-[--sky] transition-colors">Herd Immunity Simulator</Link></li>
              <li><Link href="/resources" className="hover:text-[--sky] transition-colors">Resource Hub</Link></li>
              <li><Link href="/organizations" className="hover:text-[--sky] transition-colors">For Organizations</Link></li>
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Organization</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[--sky] transition-colors">About VaxShield</Link></li>
              <li><Link href="/impact" className="hover:text-[--sky] transition-colors">Impact & Partnerships</Link></li>
              <li><Link href="/contact" className="hover:text-[--sky] transition-colors">Contact</Link></li>
              <li><Link href="/#donate" className="hover:text-[--sky] transition-colors">Donate</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Get in Touch</h3>
            <a href="mailto:hello@vaxshield.org" className="flex items-center gap-2 text-sm hover:text-[--sky] transition-colors">
              <Mail className="h-4 w-4" />
              hello@vaxshield.org
            </a>
            <p className="text-sm text-white/60 mt-3">
              University of Michigan<br />
              Ann Arbor, Michigan
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} VaxShield. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
