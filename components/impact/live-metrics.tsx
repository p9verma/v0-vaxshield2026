"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Activity, Download, School } from "lucide-react"

interface Stats {
  people_reached: number
  simulator_runs: number
  resources_downloaded: number
  schools_engaged: number
}

const FALLBACK: Stats = {
  people_reached: 14800,
  simulator_runs: 6200,
  resources_downloaded: 3400,
  schools_engaged: 28,
}

const META = [
  { key: "people_reached" as const,       icon: Users,     label: "People Reached",          description: "Across website visits and community events" },
  { key: "simulator_runs" as const,        icon: Activity,  label: "Simulator Engagements",   description: "Students and educators using the herd immunity tool" },
  { key: "resources_downloaded" as const,  icon: Download,  label: "Resources Downloaded",    description: "Lesson plans, worksheets, and infographics" },
  { key: "schools_engaged" as const,       icon: School,    label: "Schools & Sites Engaged", description: "From Ann Arbor to Detroit and beyond" },
]

function useCountUp(target: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, started])
  return count
}

function MetricCard({ icon: Icon, value, label, description, started }: {
  icon: React.ElementType; value: number; label: string; description: string; started: boolean
}) {
  const count = useCountUp(value, 2000, started)
  return (
    <div className="bg-sky-50 rounded-2xl p-6 border border-sky-600/20 text-center">
      <div className="w-12 h-12 rounded-full bg-sky-600/15 flex items-center justify-center mx-auto mb-3">
        <Icon className="h-6 w-6 text-sky-600" aria-hidden="true" />
      </div>
      <p className="text-4xl font-bold text-slate-900 mb-1 tabular-nums">{count.toLocaleString()}+</p>
      <p className="font-semibold text-slate-900 text-sm">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}

export function LiveMetrics() {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [stats, setStats] = useState<Stats>(FALLBACK)

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {META.map(({ key, icon, label, description }) => (
        <MetricCard key={label} icon={icon} value={stats[key]} label={label} description={description} started={started} />
      ))}
    </div>
  )
}
