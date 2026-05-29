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

function useCountUp(target: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, started])
  return count
}

function MetricCard({
  icon: Icon, value, label, started,
}: {
  icon: React.ElementType; value: number; label: string; started: boolean
}) {
  const count = useCountUp(value, 2000, started)
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[--sky-pale] border border-[--sky]/20">
      <div className="w-12 h-12 rounded-full bg-[--sky]/15 flex items-center justify-center mb-3">
        <Icon className="h-6 w-6 text-[--sky]" aria-hidden="true" />
      </div>
      <p className="text-4xl font-bold text-[--navy] tabular-nums">
        {count.toLocaleString()}+
      </p>
      <p className="text-sm font-medium text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

export function ImpactCounter() {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [stats, setStats] = useState<Stats>(FALLBACK)

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setStarted(true); observer.disconnect() }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const metrics = [
    { icon: Users,     value: stats.people_reached,       label: "People Reached" },
    { icon: Activity,  value: stats.simulator_runs,        label: "Simulator Engagements" },
    { icon: Download,  value: stats.resources_downloaded,  label: "Resources Downloaded" },
    { icon: School,    value: stats.schools_engaged,       label: "Schools & Sites Engaged" },
  ]

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Live Impact</p>
          <h2 className="text-3xl font-bold text-[--navy] text-balance">Measuring our reach</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Every visit, simulation, and download counts. Here&apos;s how far VaxShield&apos;s education has traveled.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} icon={m.icon} value={m.value} label={m.label} started={started} />
          ))}
        </div>
      </div>
    </section>
  )
}
