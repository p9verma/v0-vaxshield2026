"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, ExternalLink } from "lucide-react"

export function SimulatorSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const tracked = useRef(false)

  useEffect(() => {
    const handleBlur = () => {
      if (!tracked.current && document.activeElement === iframeRef.current) {
        tracked.current = true
        fetch("/api/track/simulator", { method: "POST" }).catch(() => {})
      }
    }
    window.addEventListener("blur", handleBlur)
    return () => window.removeEventListener("blur", handleBlur)
  }, [])

  return (
    <section id="simulator" className="py-16 bg-[--sky-pale]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Featured Tool</p>
          <h2 className="text-3xl font-bold text-[--navy] text-balance mb-3">
            VaxImpact Herd Immunity Simulator
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Watch in real time how vaccination rates affect disease spread.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[--sky]/20 overflow-hidden">
          <div className="bg-[--navy] px-5 py-3 flex items-center justify-between">
            <p className="text-white text-sm font-semibold">VaxImpact Simulator</p>
            <a
              href="https://herdimmunitysimulation.base44.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Open simulator in full screen"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <iframe
            ref={iframeRef}
            src="https://herdimmunitysimulation.base44.app/"
            title="VaxImpact Herd Immunity Simulator"
            className="w-full"
            style={{ height: "2000px" }}
            allow="fullscreen"
            loading="lazy"
          />
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <Button asChild variant="outline" className="gap-2 border-[--sky] text-[--sky] hover:bg-[--sky] hover:text-white">
            <Link href="/resources">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              All Resources
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 border-[--sky] text-[--sky] hover:bg-[--sky] hover:text-white">
            <a href="https://herdimmunitysimulation.base44.app/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Full Screen
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
