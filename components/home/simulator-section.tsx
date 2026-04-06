"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { Play, RotateCcw, BookOpen } from "lucide-react"

const GRID_SIZE = 18
const TOTAL = GRID_SIZE * GRID_SIZE

type CellState = "susceptible" | "vaccinated" | "infected" | "recovered"

// Deterministic initial state for SSR (all susceptible)
function buildEmptyGrid(): CellState[] {
  return Array(TOTAL).fill("susceptible") as CellState[]
}

// Randomized grid only called on client
function buildRandomizedGrid(vaccinationRate: number): CellState[] {
  const grid: CellState[] = Array(TOTAL).fill("susceptible")
  const vaccCount = Math.round(TOTAL * (vaccinationRate / 100))
  const indices = Array.from({ length: TOTAL }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  for (let i = 0; i < vaccCount; i++) grid[indices[i]] = "vaccinated"
  const susceptible = indices.filter((idx) => grid[idx] === "susceptible")
  if (susceptible.length > 0) grid[susceptible[0]] = "infected"
  return grid
}

const cellColor: Record<CellState, string> = {
  susceptible: "bg-slate-200",
  vaccinated: "bg-[--sky]",
  infected: "bg-red-500",
  recovered: "bg-green-400",
}

export function SimulatorSection() {
  const [vacRate, setVacRate] = useState(60)
  const [grid, setGrid] = useState<CellState[]>(buildEmptyGrid)
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initialize with random grid after hydration
  useEffect(() => {
    setGrid(buildRandomizedGrid(60))
    setMounted(true)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRunning(false)
    setStep(0)
    setGrid(buildRandomizedGrid(vacRate))
  }, [vacRate])

  const runStep = useCallback((current: CellState[]) => {
    const next = [...current]
    const spread = 0.35
    for (let i = 0; i < TOTAL; i++) {
      if (current[i] !== "infected") continue
      const row = Math.floor(i / GRID_SIZE)
      const col = i % GRID_SIZE
      const neighbors = [
        row > 0 ? i - GRID_SIZE : -1,
        row < GRID_SIZE - 1 ? i + GRID_SIZE : -1,
        col > 0 ? i - 1 : -1,
        col < GRID_SIZE - 1 ? i + 1 : -1,
      ]
      for (const n of neighbors) {
        if (n >= 0 && current[n] === "susceptible" && Math.random() < spread) {
          next[n] = "infected"
        }
      }
      if (Math.random() < 0.25) next[i] = "recovered"
    }
    return next
  }, [])

  const startSimulation = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setRunning(false)
      return
    }
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setGrid((g) => {
        const next = runStep(g)
        const stillInfected = next.some((c) => c === "infected")
        if (!stillInfected) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setRunning(false)
        }
        return next
      })
      setStep((s) => s + 1)
    }, 200)
  }

  const infected = grid.filter((c) => c === "infected").length
  const vaccinated = grid.filter((c) => c === "vaccinated").length
  const recovered = grid.filter((c) => c === "recovered").length
  const susceptible = grid.filter((c) => c === "susceptible").length

  return (
    <section id="simulator" className="py-16 bg-[--sky-pale]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Featured Tool</p>
            <h2 className="text-3xl font-bold text-[--navy] text-balance mb-4">
              Herd Immunity Simulator
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Watch in real time how vaccination rates affect disease spread through a community. Adjust the slider and hit play — this is the science behind herd immunity, visualized.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" /> Susceptible</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[--sky] inline-block" /> Vaccinated</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Infected</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> Recovered</li>
            </ul>
            <Button asChild variant="outline" className="gap-2 border-[--sky] text-[--sky] hover:bg-[--sky] hover:text-white">
              <Link href="/resources">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Pair with a Lesson Plan
              </Link>
            </Button>
          </div>

          {/* Right: simulator */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[--sky]/20">
            {/* Controls */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-medium text-[--navy] mb-2">
                <span>Vaccination Rate</span>
                <span className="text-[--sky] font-bold">{vacRate}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={5}
                value={[vacRate]}
                onValueChange={([v]) => { setVacRate(v); reset() }}
                className="mb-4"
                aria-label="Vaccination rate"
              />
              <div className="flex gap-3">
                <Button
                  size="sm"
                  onClick={startSimulation}
                  className="flex-1 bg-[--sky] text-white hover:bg-[--sky]/80 gap-2"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  {running ? "Pause" : "Run Simulation"}
                </Button>
                <Button size="sm" variant="outline" onClick={reset} aria-label="Reset simulation">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* Grid */}
            <div
              className="grid gap-0.5 mb-4"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              aria-label="Disease spread simulation grid"
            >
              {grid.map((state, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm transition-colors duration-150 ${cellColor[state]}`}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div><p className="font-bold text-slate-500">{susceptible}</p><p className="text-muted-foreground">Susceptible</p></div>
              <div><p className="font-bold text-[--sky]">{vaccinated}</p><p className="text-muted-foreground">Vaccinated</p></div>
              <div><p className="font-bold text-red-500">{infected}</p><p className="text-muted-foreground">Infected</p></div>
              <div><p className="font-bold text-green-500">{recovered}</p><p className="text-muted-foreground">Recovered</p></div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">Step {step}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
