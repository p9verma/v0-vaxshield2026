import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function POST() {
  const count = await redis.incr("simulator_runs")
  return NextResponse.json({ count })
}
