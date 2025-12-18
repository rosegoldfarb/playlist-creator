import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
});

redis.on('error', (err) => {
  console.error('Redis error', err);
});

export async function initRedis(): Promise<void> {
  if (redis.isOpen) return;

  try {
    await redis.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis', err);
    throw err;
  }
}

export async function shutdownRedis(): Promise<void> {
  try {
    if (redis.isOpen) {
      await redis.quit();
      console.log('Redis client closed');
    }
  } catch (err) {
    console.error('Error while shutting down Redis', err);
  }
}

process.on('SIGINT', async () => {
  await shutdownRedis();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdownRedis();
  process.exit(0);
});
