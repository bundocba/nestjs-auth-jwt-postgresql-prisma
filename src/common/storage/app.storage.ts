import { AsyncLocalStorage } from 'async_hooks'

import { Request } from 'express'

export type Context = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctxId: any
  request: Request
}
export const appStorage = new AsyncLocalStorage<Context>();
