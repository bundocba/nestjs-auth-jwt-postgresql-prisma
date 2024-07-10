import { ApiProperty } from '@nestjs/swagger'
import { ExceptionMessages, ExceptionType } from '../constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CoreRes<T = any> {
  code: string
  data: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessages?: Array<any>
  message: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SuccessResponse<T = any>
  implements Omit<CoreRes<T>, 'errorMessages' | 'message'>
{
  @ApiProperty({
    type: String,
  })
  code: string;
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;
  data: T;
  constructor(data: T) {
    this.code = 'SUCCESS';
    this.data = data
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ErrorResponse<T = any> implements Omit<CoreRes<T>, 'data'> {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessages?: Array<any>;
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(exceptionCode: ExceptionType, errorMessages?: Array<any>) {
    this.code = exceptionCode;
    this.errorMessages = errorMessages;
    this.message = ExceptionMessages[exceptionCode]?.message ?? exceptionCode
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WarningResponse<T = any>
  implements Omit<CoreRes<T>, 'errorMessages'>
{
  message: string;
  code: string;
  data: T;
  constructor(data: T, exceptionCode: ExceptionType) {
    this.code = exceptionCode;
    this.data = data;
    this.message = ExceptionMessages[exceptionCode]?.message ?? exceptionCode
  }
}
