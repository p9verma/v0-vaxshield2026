import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Handshake } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[--navy] text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-community.jpg"
          alt=""
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[--sky] text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="h-px w-6 bg-[--sky]" aria-hidden="true" />
            Nonprofit Education Platform
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-balance mb-6">
            Shield your loved ones.<br />
            <span className="text-[--sky]">Start with knowledge.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-8 max-w-2xl">
            VaxShield reduces vaccine misinformation through interactive education, accessible resources, and community outreach — helping students, families, and clinics make informed public health decisions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-[--sky] text-white hover:bg-[--sky]/80 font-semibold gap-2">
              <Link href="/resources">
                Explore Tools
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/30 text-white hover:bg-white/10 hover:text-white gap-2">
              <Link href="/vaxsearch">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Find Vaccines Near You
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 gap-2">
              <Link href="/organizations">
                <Handshake className="h-4 w-4" aria-hidden="true" />
                Partner With Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
