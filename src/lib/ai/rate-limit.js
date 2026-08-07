import 'server-only'

// Simple in-memory token bucket per key. Per-process; fine for single-node dev.
const PER_MIN = Number(process.env.AI_RATE_LIMIT_PER_MIN || 12)
const WINDOW_MS = 60_000
const buckets = new Map()

export async function rateLimit(key) {
  const now = Date.now()
  const bucket = buckets.get(key) || { count: 0, resetAt: now + WINDOW_MS }
  if (now > bucket.resetAt) {
    bucket.count = 0
    bucket.resetAt = now + WINDOW_MS
  }
  bucket.count += 1
  buckets.set(key, bucket)
  return bucket.count > PER_MIN
}
