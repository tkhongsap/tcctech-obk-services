import { createClient, RedisClientType } from 'redis';
import logging from '../utils/logging';

class CacheAdapter {
  private redisClient?: RedisClientType;

  constructor() {
    if (process.env.CACHE_REDIS === 'true') {
      this.redisClient = createClient({
        url: process.env.CACHE_REDIS_URL ?? 'redis://localhost:6379',
      });

      this.redisClient?.connect().catch(console.error);
    }
  }

  async get(key: string): Promise<string | null> {
    const value = await this.redisClient?.get(key);
    logging.info(`[CACHE.REDIS.GET] ${key}:${value}`);
    if (value) {
      return value;
    }

    return null;
  }

  async set(key: string, value: string, ttl: number = 0): Promise<void> {
    if (ttl > 0) {
      await this.redisClient?.set(key, value, { ['EX' as string]: ttl });
    } else {
      await this.redisClient?.set(key, value);
    }
    logging.info(`[CACHE.REDIS.SET] ${key}:${value}`);
  }

  async getSet(key: string, newValueFn: () => Promise<string>, ttl: number = 0): Promise<string> {
    let value = await this.get(key);

    if (value === null || value === '' || value === '[]') {
      value = await newValueFn();
      if (value !== null || value !== '' || value !== '[]') {
        await this.set(key, value, ttl);
      }
    }

    return value;
  }

  async delete(key: string): Promise<void> {
    const numDeleted = await this.redisClient?.del(key);
    logging.info(`[CACHE.REDIS.DEL] Deleted ${numDeleted} keys`);
  }
}

const cache = new CacheAdapter();

export const Cache = (key: string, ttl: number) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyKey}:${key}`;
      const cachedValue = await cache.get(cacheKey);

      if (cachedValue) {
        return JSON.parse(cachedValue);
      }

      const result = await originalMethod.apply(this, args);
      await cache.set(cacheKey, JSON.stringify(result), ttl);

      return result;
    };

    return descriptor;
  };
};

export default cache;
