import NodeCache from 'node-cache';
import { createClient, RedisClientType } from 'redis';
import logging from '../utils/logging';

class CacheAdapter {
  private localCache: NodeCache;
  private redisClient?: RedisClientType;
  private pubSubClient?: RedisClientType;

  private redisGetAsync?: (key: string) => Promise<string | null>;
  private redisSetAsync?: (key: string, value: string, mode?: string, duration?: number) => Promise<unknown>;
  private redisDelAsync?: (key: string) => Promise<number>;

  constructor() {
    this.localCache = new NodeCache();

    if (process.env.CACHE_REDIS === 'true') {
      this.redisClient = createClient({
        url: process.env.CACHE_REDIS_URL ?? 'redis://localhost:6379',
      });

      this.pubSubClient = this.redisClient.duplicate();

      this.redisClient
        .connect()
        .then(() => {
          logging.info({ redisClient: this.redisClient?.isReady });
        })
        .catch(console.error);

      this.pubSubClient
        .connect()
        .then(() => {
          logging.info('Pub/Sub client connected');
          this.pubSubClient?.subscribe('__keyevent@0__:set', (message) => {
            this.handleRedisKeyEvent(message);
          });
          this.pubSubClient?.subscribe('__keyevent@0__:del', (message) => {
            this.handleRedisKeyEvent(message);
          });
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

  private handleRedisKeyEvent(message: string) {
    logging.info(`Redis key event received: ${message}`);
    this.localCache.del(message);
  }

  private async publishEvent(channel: string, message: string): Promise<void> {
    if (this.redisClient) {
      try {
        await this.redisClient.publish(channel, message);
        logging.info(`Published event to ${channel}: ${message}`);
      } catch (error) {
        console.error(`Error publishing event to ${channel}: ${error}`);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    let value = this.localCache.get<string>(key) ?? null;
    logging.info(`[CACHE.LOCAL.GET] ${key}:${value}`);
    if (value) return value;

    if (this.redisGetAsync) {
      value = await this.redisGetAsync(key);
      logging.info(`[CACHE.REDIS.GET] ${key}:${value}`);
      if (value) {
        this.localCache.set(key, value);
        return value;
      }
    }

    return null;
  }

  async set(key: string, value: string, ttl: number = 0, setValueRedis: boolean): Promise<void> {
    this.localCache.set(key, value, ttl);
    logging.info(`[CACHE.LOCAL.SET] ${key}:${value}`);

    if (this.redisSetAsync && setValueRedis) {
      if (ttl > 0) {
        await this.redisSetAsync(key, value, 'EX', ttl);
      } else {
        await this.redisSetAsync(key, value);
      }
      await this.publishEvent('__keyevent@0__:set', key);
      logging.info(`[CACHE.REDIS.SET] ${key}:${value}`);
    }
  }

  async getSet(
    key: string,
    setValueRedis: boolean = true,
    newValueFn: () => Promise<string>,
    ttl: number = 0,
  ): Promise<string> {
    let value = await this.get(key);

    if (value === null) {
      value = await newValueFn();
      await this.set(key, value, ttl, setValueRedis);
    }

    return value;
  }

  async delete(key: string): Promise<void> {
    this.localCache.del(key);
    logging.info(`[CACHE.LOCAL.DEL] ${key}`);

    if (this.redisDelAsync) {
      const numDeleted = await this.redisDelAsync(key);
      logging.info(`[CACHE.REDIS.DEL] Deleted ${numDeleted} keys`);
      if (numDeleted > 0) {
        await this.publishEvent('__keyevent@0__:del', key);
      }
    }
  }
}

const cache = new CacheAdapter();
export default cache;
