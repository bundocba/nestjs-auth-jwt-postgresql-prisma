import { Injectable } from '@nestjs/common'
import { CacheService } from '../interfaces'

@Injectable()
export class MemoryCacheService implements CacheService {
  static caches
  async set(
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    ttl: number,
    nx: '' | 'NX' = 'NX',
  ): Promise<void> {
    return {
      '': () => {
        MemoryCacheService.caches[key] = {
          value,
          expireAt: Date.now() + ttl,
          ttl,
        }
        // Set a timeout to automatically delete the data after TTL
        setTimeout(() => {
          this.delete(key)
        }, ttl)
      },
      NX: () => {
        // if (this.has(key)) {
        MemoryCacheService.caches[key] = {
          value,
          expireAt: Date.now() + ttl,
          ttl,
        }

        // Set a timeout to automatically delete the data after TTL
        setTimeout(() => {
          this.delete(key)
        }, ttl)
        // }
      },
    }[nx ?? '']()
  }
  async get<T>(key: string): Promise<T> {
    return new Promise(resolve => {
      const item = MemoryCacheService.caches[key]
      if (item && Date.now() < item.expireAt) {
        resolve(item.value as T)
      }
      // If data has expired or doesn't exist, remove it from the cache and return null
      this.delete(key)
      resolve(null)
    })
  }
  async delete(key: string): Promise<void> {
    delete MemoryCacheService.caches[key]
  }
  ttl(key: string, callback?: (result: number, exception: Error) => void) {
    throw new Error('Method not implemented.')
  }
  private clear() {
    MemoryCacheService.caches = {}
  }
  onModuleInit() {
    if (!MemoryCacheService.caches) this.clear()
  }
}
