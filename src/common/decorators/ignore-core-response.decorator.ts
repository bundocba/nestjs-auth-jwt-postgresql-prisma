import { SetMetadata } from '@nestjs/common'
export const IGNORE_CORE_RESPONSE_KEY = Symbol('IGNORE_CORE_RESPONSE_KEY')
export const IgnoreCoreResponse = () =>
  SetMetadata(IGNORE_CORE_RESPONSE_KEY, true)
