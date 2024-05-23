import { Controller } from '@nestjs/common'
import { appStorage } from '../storage'

@Controller()
export abstract class BaseController {
  get getRequest() {
    return appStorage?.getStore()?.request
  }
  protected get scopeVariable() {
    return this.getRequest?.scopeVariable
  }
  protected get currentSession() {
    return this.scopeVariable?.session
  }
}
