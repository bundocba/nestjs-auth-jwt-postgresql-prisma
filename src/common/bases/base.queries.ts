import { Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { PrismaService } from '../prisma'

export type ClientTransaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export interface BaseRepositoryInterface {
  joinTransaction(client: ClientTransaction): Omit<this, 'joinTransaction'>
}

@Injectable()
export abstract class BaseRepository implements BaseRepositoryInterface {
  constructor(protected readonly client: PrismaService) {}

  joinTransaction(client: ClientTransaction): Omit<this, 'joinTransaction'> {
    const thisRepo = this.constructor as new (...args: unknown[]) => typeof this;
    const cls = new (class extends thisRepo {})(client)
    return cls as typeof this;
  }
}
