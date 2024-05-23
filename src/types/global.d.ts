import {ScopeVariable} from "@common/memories";

declare global {
  namespace Express {
    export interface Request {
      scopeVariable: ScopeVariable
    }
  }
}
