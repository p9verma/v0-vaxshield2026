"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { BookOpen, Download, ExternalLink, ShieldCheck, Zap, Users, Activity } from "lucide-react"

// Herd immunity thresholds by R0
// R_effective = R0 * (1 - vaccinationRate)
// Herd immunity achieved when R_effective < 1
// Threshold = 1 - 1/R0
const R0_MEASLES = 15
const VACCINE_EFFICACY = 0.95

function computeStats(vacRate: number) {
  const vaccinated = vacRate / 100
  const effectivelyImmune = vaccinated * VACCINE_EFFICACY
  const susceptible = 1 - effectivelyImmune
  const rEffective = R0_MEASLES * susceptible
  const herdThreshold = Math.round((1 - 1 / R0_MEASLES) * 100)
  const outbreak = rEffective >= 1
  const percentSusceptible = Math.round(susceptible * 100)
  const percentProtected = Math.round(effectivelyImmune * 100)
  return { rEffective, herdThreshold, outbreak, percentSusceptible, percentProtected }
}

export function SimulatorSection() {
  const [vacRate, setVacRate] = useState(60)
  const stats = computeStats(vacRate)

  return (
    <section id="simulator" className="py-16 bg-[--sky-pale]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-10">
          <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Featured Tool</p>
          <h2 className="text-3xl font-bold text-[--navy] text-balance mb-3">
            VaxImpact Herd Immunity Simulator
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Watch in real time how vaccination rates affect disease spread. Use the slider below to set a vaccination rate and observe the live statistics before running the full simulation.
          </p>
        </div>

        {/* Main layout: stats on left, iframe on right */}
        <div className="grid xl:grid-cols-[340px_1fr] gap-6 items-start">

          {/* Stats panel */}
          <div className="flex flex-col gap-4">

            {/* Vaccination rate control */}
            <div className="bg-white rounded-2xl border border-[--sky]/20 shadow-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-[--navy]">Vaccination Rate</p>
                <span className="text-2xl font-bold text-[--sky]">{vacRate}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[vacRate]}
                onValueChange={([v]) => setVacRate(v)}
                className="my-3"
                aria-label="Set vaccination rate"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>Herd immunity threshold: {stats.herdThreshold}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Status badge */}
            <div
              className={`rounded-2xl border px-5 py-4 flex items-center gap-3 ${
                stats.outbreak
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  stats.outbreak ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <ShieldCheck
                  className={`h-5 w-5 ${stats.outbreak ? "text-red-500" : "text-green-600"}`}
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className={`text-sm font-bold ${stats.outbreak ? "text-red-700" : "text-green-700"}`}>
                  {stats.outbreak ? "Outbreak Risk" : "Herd Immunity Achieved"}
                </p>
                <p className={`text-xs ${stats.outbreak ? "text-red-500" : "text-green-600"}`}>
                  {stats.outbreak
                    ? `Raise vaccination to ${stats.herdThreshold}%+ to stop spread`
                    : "Community is protected from sustained outbreaks"}
                </p>
              </div>
            </div>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-[--sky]/20 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-[--sky]" aria-hidden="true" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">R-Effective</p>
                </div>
                <p className={`text-3xl font-bold tabular-nums ${stats.rEffective >= 1 ? "text-red-500" : "text-green-600"}`}>
                  {stats.rEffective.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.rEffective >= 1 ? "Spreading" : "Dying out"}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[--sky]/20 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-red-400" aria-hidden="true" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">R0 (Measles)</p>
                </div>
                <p className="text-3xl font-bold tabular-nums text-[--navy]">15</p>
                <p className="text-xs text-muted-foreground mt-1">Base reproduction number</p>
              </div>

              <div className="bg-white rounded-xl border border-[--sky]/20 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-[--sky]" aria-hidden="true" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Protected</p>
                </div>
                <p className="text-3xl font-bold tabular-nums text-[--sky]">{stats.percentProtected}%</p>
                <p className="text-xs text-muted-foreground mt-1">Effectively immune</p>
              </div>

              <div className="bg-white rounded-xl border border-[--sky]/20 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Susceptible</p>
                </div>
                <p className="text-3xl font-bold tabular-nums text-amber-500">{stats.percentSusceptible}%</p>
                <p className="text-xs text-muted-foreground mt-1">At risk of infection</p>
              </div>
            </div>

            {/* Worksheet downloads */}
            <div className="bg-white rounded-2xl border border-[--sky]/20 shadow-sm p-4">
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
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[--navy] group-hover:text-[--sky] transition-colors">Worksheet 1: Original</p>
                    <p className="text-xs text-muted-foreground">Foundational, grades 9-12</p>
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
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[--navy] group-hover:text-[--sky] transition-colors">Worksheet 2: Case Study</p>
                    <p className="text-xs text-muted-foreground">Extended outbreak scenario</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1 gap-2 border-[--sky] text-[--sky] hover:bg-[--sky] hover:text-white">
                <Link href="/resources">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  All Resources
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 gap-2 border-[--sky] text-[--sky] hover:bg-[--sky] hover:text-white">
                <a href="https://herdimmunitysimulation.base44.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Full Screen
                </a>
              </Button>
            </div>
          </div>

          {/* Live simulator iframe */}
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
              src="https://herdimmunitysimulation.base44.app/"
              title="VaxImpact Herd Immunity Simulator"
              className="w-full"
              style={{ height: "680px" }}
              allow="fullscreen"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
