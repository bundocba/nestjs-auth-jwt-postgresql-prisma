import { OnModuleInit } from '@nestjs/common'

export interface CacheService extends OnModuleInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(key: string, value: any, ttl: number, nx: '' | 'NX'): Promise<void>
  get<T>(key: string): Promise<T>
  delete(key: string): Promise<void>
  ttl(key: string, callback?: (result: number, exception: Error) => void)
}
