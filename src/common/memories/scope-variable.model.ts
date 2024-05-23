export class Session {
  userId: number;
  email: string;
  phone: string;
  avatar: string;
  registrationDate: Date;
  constructor(data: Partial<Session>) {
    Object.assign(this, data)
  }
}

export class ScopeVariable {
  accessToken?: string;
  refreshToken?: string;
  requestId?: string;
  session?: Session;
  hash?: string;
  [key: string]: unknown
  constructor(data?: Partial<ScopeVariable>) {
    Object.assign(this, data)
  }
}
