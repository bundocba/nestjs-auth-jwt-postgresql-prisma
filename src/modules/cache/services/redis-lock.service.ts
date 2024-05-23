import { Injectable, Logger } from '@nestjs/common'
import { Lock } from '../models/lock'
import { randomBytes } from 'crypto'
import { RedisCacheService } from './redis-cache.service'

@Injectable()
export class RedisLockService {
  private readonly logger: Logger

  constructor(private readonly redisService: RedisCacheService) {
    this.logger = new Logger(RedisLockService.name)
  }

  /**
   * Acquires locks with exponential backoff retry
   * @param keys string | string[]
   * @param ttl Time to live in seconds. Default is 5 seconds.
   * @param maxRetries Default is 10.
   * @param baseDelayMs Default is 200ms.
   */
  async acquireLock(
    keys: string | string[],
    ttl: number = 5,
    maxRetries: number = 10,
    baseDelayMs: number = 200,
  ): Promise<Lock> {
    const keyArray = Array.isArray(keys) ? keys : [keys]

    const lock = new Lock(
      this,
      keyArray,
      this._random(),
      0,
      new Date().getTime() + ttl * 1000,
    )
    while (lock.attempts < maxRetries && !lock.locked) {
      // Assume the lock is acquired
      lock.locked = true
      lock.expiration = new Date().getTime() + ttl * 1000
      for (const key of lock.resources) {
        const result = await this.redisService.tryLock(
          this._getLockKey(key),
          lock.value,
          ttl,
        )
        if (!result) {
          lock.locked = false
          // Release locks that were acquired before the failure
          await this.releaseLock(lock)
          this.logger.debug(
            `Retry ${lock.attempts + 1} - Lock acquisition failed for key ${key}: ${lock.value}. Retrying in ${baseDelayMs}ms.`,
          )
          await this.sleep(baseDelayMs)
          break
        }
      }
      lock.attempts++
    }
    return lock
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async releaseLock(lock: Lock): Promise<void> {
    if (lock.value) {
      const promises = lock.resources.map(async key => {
        const lockKey = this._getLockKey(key)
        // Check if the lock still has the same value before releasing
        const currentValue = await this.redisService.get<string>(lockKey, true)
        if (currentValue === lock.value) {
          await this.redisService.delete(lockKey)
        }
      })
      await Promise.all(promises)
    }
  }

  /**
   * Generate a cryptographically random string.
   */
  private _random(): string {
    return randomBytes(16).toString('hex')
  }

  private _getLockKey(key: string): string {
    return `lock:${key}`
  }
}
