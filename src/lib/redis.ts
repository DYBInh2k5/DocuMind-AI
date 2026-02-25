import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

// Rate limiting helper
export async function rateLimit(
  identifier: string,
  limit: number,
  window: number // in seconds
): Promise<{ success: boolean; remaining: number }> {
  if (!redis) {
    // If Redis not configured, allow all requests
    return { success: true, remaining: limit };
  }
  
  const key = `rate_limit:${identifier}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, window);
  }

  const remaining = Math.max(0, limit - count);
  return {
    success: count <= limit,
    remaining,
  };
}

// Cache helper
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  if (!redis) {
    // If Redis not configured, fetch directly
    return await fetcher();
  }
  
  const cached = await redis.get<T>(key);
  if (cached) return cached;

  const data = await fetcher();
  await redis.setex(key, ttl, data);
  return data;
}
