"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Download, ExternalLink } from "lucide-react"

export function SimulatorSection() {
  return (
    <section id="simulator" className="py-16 bg-[--sky-pale]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: copy */}
          <div className="lg:sticky lg:top-8">
            <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Featured Tool</p>
            <h2 className="text-3xl font-bold text-[--navy] text-balance mb-4">
              VaxImpact Herd Immunity Simulator
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Watch in real time how vaccination rates affect disease spread through a community. Adjust the parameters and run simulations to see the science behind herd immunity, visualized.
            </p>
            
            {/* Legend */}
            <div className="bg-white rounded-xl p-4 border border-[--sky]/20 mb-6">
              <p className="text-xs font-semibold text-[--navy] uppercase tracking-wide mb-3">How to Use</p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Adjust the vaccination rate slider</li>
                <li>Set transmission rate, recovery time, and other parameters</li>
                <li>Click &quot;Start Simulation&quot; to see disease spread</li>
                <li>Observe how higher vaccination rates reduce infections</li>
              </ol>
            </div>

            {/* Worksheets download */}
            <div className="bg-white rounded-xl p-4 border border-[--sky]/20 mb-6">
              <p className="text-xs font-semibold text-[--navy] uppercase tracking-wide mb-3">Pair with a Worksheet</p>
              <div className="space-y-2">
                <a 
                  href="/downloads/VaxImpact-Simulator-Worksheet.pdf" 
                  download
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[--sky-pale] transition-colors group"
                >
                  <div className="w-8 h-8 bg-[--sky]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Download className="h-4 w-4 text-[--sky]" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[--navy] group-hover:text-[--sky] transition-colors">Worksheet 1: Original</p>
                    <p className="text-xs text-muted-foreground">Foundational worksheet for grades 9-12</p>
                  </div>
                </a>
                <a 
                  href="/downloads/VaxImpact-Simulator-Case-Study.pdf" 
                  download
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[--sky-pale] transition-colors group"
                >
                  <div className="w-8 h-8 bg-[--sky]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Download className="h-4 w-4 text-[--sky]" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[--navy] group-hover:text-[--sky] transition-colors">Worksheet 2: Case Study</p>
                    <p className="text-xs text-muted-foreground">Extended version with outbreak scenario</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="gap-2 border-[--sky] text-[--sky] hover:bg-[--sky] hover:text-white">
                <Link href="/resources">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  All Resources
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2 border-[--sky] text-[--sky] hover:bg-[--sky] hover:text-white">
                <a href="https://herdimmunitysimulation.base44.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open Full Screen
                </a>
              </Button>
            </div>
          </div>

          {/* Right: embedded simulator */}
          <div className="bg-white rounded-2xl shadow-lg border border-[--sky]/20 overflow-hidden">
            <iframe
              src="https://herdimmunitysimulation.base44.app/"
              title="VaxImpact Herd Immunity Simulator"
              className="w-full aspect-[4/5] lg:aspect-[3/4]"
              allow="fullscreen"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
