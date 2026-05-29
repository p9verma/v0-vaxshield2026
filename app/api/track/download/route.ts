import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function POST() {
  const count = await redis.incr("resources_downloaded")
  return NextResponse.json({ count })
}
