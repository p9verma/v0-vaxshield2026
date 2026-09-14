"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, ExternalLink, Info } from "lucide-react"
import { MEDICAL_DISCLAIMER } from "@/lib/disclaimer"

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

        <div className="max-w-3xl mx-auto mb-6 rounded-xl border border-[--sky]/30 bg-white p-4 sm:p-5">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-[--sky] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm leading-relaxed text-muted-foreground">
              <p className="font-semibold text-[--navy] mb-1">Before you start: this is a teaching model.</p>
              <p>
                The simulator is a simplified illustration of how vaccination rates affect disease spread. It is
                not a prediction of any real outbreak. Real transmission depends on many factors this model does
                not include, such as age, waning immunity, and how people actually move and
                mix. Use it to build intuition for why herd immunity thresholds matter, not to estimate what will
                happen in your community. For medical or public health guidance, consult the{" "}
                <a
                  href="https://www.cdc.gov/vaccines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[--sky] font-medium underline underline-offset-2 hover:no-underline"
                >
                  CDC
                </a>{" "}
                or your healthcare provider.
              </p>
            </div>
          </div>
        </div>

        {/* Medical disclaimer, passive notice. Sits below the accuracy callout
            so both are read before the simulator, but nothing gates the embed. */}
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-[--navy]">Disclaimer: </span>
            {MEDICAL_DISCLAIMER}
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
