import { Global, Module } from '@nestjs/common'
import {
  MemoryCacheService,
  RedisCacheService,
  RedisLockService,
} from './services'

@Global()
@Module({
  providers: [RedisCacheService, MemoryCacheService, RedisLockService],
  exports: [RedisCacheService, MemoryCacheService, RedisLockService],
})
export class CacheModule {}
