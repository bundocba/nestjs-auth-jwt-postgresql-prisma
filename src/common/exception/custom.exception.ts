import { HttpException, HttpStatus } from '@nestjs/common'
import { ExceptionType } from '../constants'

export class BusinessException extends HttpException {
    constructor(errorCode: ExceptionType | Record<string, unknown>) {
        super(errorCode, HttpStatus.BAD_REQUEST)
    }
}

export class BusinessWarning<T> extends HttpException {
    constructor(
        data: T,
        message: ExceptionType,
        status: HttpStatus = HttpStatus.OK,
    ) {
        super({ data, message }, status)
    }
}

export class UnauthorizedException extends HttpException {
    constructor() {
        super('000-401', HttpStatus.UNAUTHORIZED)
    }
}

export class ForbiddenException extends HttpException {
    constructor() {
        super('ACCESS_DENIED', HttpStatus.FORBIDDEN)
    }
}
