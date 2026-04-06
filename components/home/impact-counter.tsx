"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Activity, Download, School } from "lucide-react"

interface ImpactMetric {
  icon: React.ElementType
  value: number
  label: string
  suffix: string
  color: string
}

const metrics: ImpactMetric[] = [
  { icon: Users, value: 14800, label: "People Reached", suffix: "+", color: "text-[--sky]" },
  { icon: Activity, value: 6200, label: "Simulator Runs", suffix: "+", color: "text-[--sky]" },
  { icon: Download, value: 3400, label: "Resources Downloaded", suffix: "+", color: "text-[--sky]" },
  { icon: School, value: 28, label: "Schools & Sites Engaged", suffix: "+", color: "text-[--sky]" },
]

function useCountUp(target: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, started])
  return count
}

function MetricCard({ metric, started }: { metric: ImpactMetric; started: boolean }) {
  const count = useCountUp(metric.value, 2000, started)
  const Icon = metric.icon
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[--sky-pale] border border-[--sky]/20">
      <div className="w-12 h-12 rounded-full bg-[--sky]/15 flex items-center justify-center mb-3">
        <Icon className={`h-6 w-6 ${metric.color}`} aria-hidden="true" />
      </div>
      <p className="text-4xl font-bold text-[--navy] tabular-nums">
        {count.toLocaleString()}{metric.suffix}
      </p>
      <p className="text-sm font-medium text-muted-foreground mt-1">{metric.label}</p>
    </div>
  )
}

export function ImpactCounter() {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

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
            <MetricCard key={m.label} metric={m} started={started} />
          ))}
        </div>
      </div>
    </section>
  )
}
