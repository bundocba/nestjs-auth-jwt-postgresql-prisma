import { RedisLockService } from '@cache'

export class Lock {
  public locked: boolean = false

  constructor(
    public readonly redlock: RedisLockService,
    public readonly resources: string[],
    public readonly value: string,
    public attempts: number,
    public expiration: number,
  ) {}

  async release(): Promise<void> {
    return this.redlock.releaseLock(this)
  }
}
