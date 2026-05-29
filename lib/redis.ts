const url = process.env.UPSTASH_REDIS_REST_URL!
const token = process.env.UPSTASH_REDIS_REST_TOKEN!

async function upstash<T>(command: unknown[]): Promise<T> {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  })
  const json = await res.json()
  return json.result as T
}

export const redis = {
  incr: (key: string) => upstash<number>(["INCR", key]),
  get: <T>(key: string) => upstash<T | null>(["GET", key]),
}
