import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not set in environment variables');
}

export const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.log('Redis error:', err.message));