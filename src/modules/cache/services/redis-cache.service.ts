import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { Configuration } from 'src/common'
import { CacheService } from '../interfaces'
import { MemoryCacheService } from './memory-cache.service'

@Injectable()
export class RedisCacheService implements CacheService {
  private readonly logger: Logger;
  private redisClient: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly memoryCacheService: MemoryCacheService,
  ) {
    this.logger = new Logger(RedisCacheService.name)
  }

  async health() {
    try {
      const result = await this.redisClient.ping()
      return result === 'PONG'
    } catch (ex) {
      return false
    }
  }

  async set(
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    ttl: number,
    nx: '' | 'NX' = 'NX',
  ): Promise<void> {
    try {
      await this.memoryCacheService.set(key, value, ttl, nx)

      await {
        '': async () => {
          return await this.redisClient.set(
            key,
            JSON.stringify(value),
            'EX',
            ttl,
          )
        },
        NX: async () => {
          await this.redisClient.set(
            key,
            JSON.stringify(value),
            'EX',
            ttl,
            'NX',
          )
        },
      }[nx ?? '']()
    } catch (ex) {
      this.logger.error(ex)
      return null
    }
  }

  async get<T>(key: string, raw: boolean = false): Promise<T> {
    try {
      const data = await this.memoryCacheService.get<T>(key)
      if (data) return data

      const redisCache = await this.redisClient.get(key)
      if (raw) {
        return redisCache as string as T
      }
      const redisData = JSON.parse(redisCache) as T
      if (redisData) {
        this.redisClient.ttl(key).then(ttl => {
          this.memoryCacheService.set(key, redisData, ttl)
        })
      }
      return redisData
    } catch (ex) {
      this.logger.error(ex)
      return null
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.memoryCacheService.delete(key)
      const keys = await this.redisClient.keys(key)
      if (keys?.length)
        await Promise.all(keys.map(key => this.redisClient.del(key)))
    } catch (ex) {
      this.logger.error(ex)
      return null
    }
  }

  ttl(key: string, callback?: (result: number, exception: Error) => void) {
    try {
      return this.redisClient.ttl(key, (...args) => callback(args[1], args[0]))
    } catch (ex) {
      this.logger.error(ex)
      return null
    }
  }

  async tryLock(
    key: string,
    value: string | Buffer | number,
    ttl = 60,
  ): Promise<boolean> {
    const result = await this.redisClient.set(key, value, 'EX', ttl, 'NX');
    return result === 'OK'
  }

  async unlock(key: string): Promise<void> {
    await this.redisClient.del(key)
  }

  onModuleInit() {
    try {
      const { redis } =
        this.configService.get<Configuration['caching']>('caching');
      this.redisClient = new Redis({
        ...redis,
        lazyConnect: true,
        commandTimeout: 2000,
        connectTimeout: 2000,
        maxLoadingRetryTime: 3,
      })
    } catch (ex) {
      this.logger.error(ex, 'Cannot Connect REDIS')
    }
  }
}
