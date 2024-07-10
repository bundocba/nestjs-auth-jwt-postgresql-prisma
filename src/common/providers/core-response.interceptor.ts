import { APP_INTERCEPTOR } from '@nestjs/core'
import { CoreResponseInterceptor } from '../interceptors'

export const responseInterceptor = {
  provide: APP_INTERCEPTOR,
  useClass: CoreResponseInterceptor,
}
