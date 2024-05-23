import { SetMetadata } from '@nestjs/common'
import { LOCAL_AUTHORIZE_KEY } from '../constants'

/**
 *
 * @param moduleCode Module Code
 * @param permission Access Permission
 * @returns
 */
export const Authorize = (moduleCode?: string, permission: string = null) => {
  return SetMetadata(LOCAL_AUTHORIZE_KEY, { moduleCode, permission })
}
