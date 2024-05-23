import { Injectable } from '@nestjs/common'
import { appStorage } from '../storage'

@Injectable()
export abstract class BaseService {
  protected get getRequest() {
    return appStorage?.getStore()?.request
  }
  protected get scopeVariable() {
    return this.getRequest?.scopeVariable
  }
  protected get currentSession() {
    return this.scopeVariable?.session
  }
}
