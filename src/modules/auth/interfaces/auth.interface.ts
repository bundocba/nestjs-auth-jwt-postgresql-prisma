import { Session } from '~/common'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  userInfo: Session
}
