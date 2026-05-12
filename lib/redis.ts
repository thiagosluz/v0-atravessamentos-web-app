import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

// Redis client for caching
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Rate limiter for API protection
// 5 requests per 10 seconds per IP
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
})
