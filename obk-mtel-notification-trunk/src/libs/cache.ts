import NodeCache from 'node-cache';
import { createClient, RedisClientType } from 'redis';

class CacheAdapter {
  private localCache: NodeCache;
  private redisClient?: RedisClientType;
  private redisGetAsync?: (key: string) => Promise<string | null>;
  private redisSetAsync?: (key: string, value: string, mode?: string, duration?: number) => Promise<unknown>;
  private redisDelAsync?: (key: string) => Promise<number>;

  constructor() {
    this.localCache = new NodeCache();

    if (process.env.CACHE_REDIS === 'true') {
      this.redisClient = createClient({
        url: process.env.CACHE_REDIS_URL ?? 'redis://localhost:6379',
      });
      this.redisClient
        .connect()
        .then(() => {
          console.log({ redisClient: this.redisClient?.isReady });
        })
        .catch(console.error);
      this.redisGetAsync = (key: string) => {
        return new Promise((resolve) => {
          resolve(this.redisClient?.get(key) || null);
        });
      };
      this.redisSetAsync = (key: string, value: string, mode?: string, duration?: number) => {
        return new Promise((resolve) => {
          resolve(this.redisClient?.set(key, value, { [mode as string]: duration }) || null);
        });
      };
      this.redisDelAsync = (key: string) => {
        return new Promise((resolve) => {
          resolve(this.redisClient?.del(key) as unknown as number);
        });
      };
    }
  }

  async get(key: string): Promise<string | null> {
    let value = this.localCache.get<string>(key) ?? null;
    console.log(`[CACHE.LOCAL.GET] ${key}:${value}`);
    if (value) return value;

    if (this.redisGetAsync) {
      value = await this.redisGetAsync(key);
      console.log(`[CACHE.REDIS.GET] ${key}:${value}`);
      if (value) {
        this.localCache.set(key, value);
        return value;
      }
    }

    return null;
  }

  async set(key: string, value: string, ttl: number = 0): Promise<void> {
    this.localCache.set(key, value, ttl);
    console.log(`[CACHE.LOCAL.SET] ${key}:${value}`);

    if (this.redisSetAsync) {
      if (ttl > 0) {
        await this.redisSetAsync(key, value, 'EX', ttl);
      } else {
        await this.redisSetAsync(key, value);
      }
      console.log(`[CACHE.REDIS.SET] ${key}:${value}`);
    }
  }

  async getSet(key: string, newValueFn: () => Promise<string>, ttl: number = 0): Promise<string> {
    let value = await this.get(key);

    if (value === null) {
      value = await newValueFn();
      await this.set(key, value, ttl);
    }

    return value;
  }

  async delete(key: string): Promise<void> {
    this.localCache.del(key);

    if (this.redisDelAsync) {
      await this.redisDelAsync(key);
    }
  }
}

const cache = new CacheAdapter();
export default cache;
