import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { instanceToPlain } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { IGNORE_CORE_RESPONSE_KEY } from '../decorators/ignore-core-response.decorator'
import { SuccessResponse } from '../response'

@Injectable()
export class CoreResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Observable<SuccessResponse | any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Promise<Observable<SuccessResponse | any>> {
    const observable = next.handle()
    return observable.pipe(
      map(data => {
        const excludeCoreInterceptor =
          this.reflector.get(IGNORE_CORE_RESPONSE_KEY, context.getClass()) ||
          this.reflector.get(IGNORE_CORE_RESPONSE_KEY, context.getHandler())
        if (
          excludeCoreInterceptor
        ) {
          return data
        }
        return new SuccessResponse(
          instanceToPlain(data, {
            strategy: 'exposeAll',
            excludePrefixes: [
              '_',
              '__',
            ],
            exposeUnsetFields: true,
          }),
        )
      }),
    )
  }
}
