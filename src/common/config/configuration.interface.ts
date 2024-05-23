
export interface CachingConfig {
  host: string
  port: number
  db?: number
}

export interface Configuration {
  env: string | 'production';
  isProduction: boolean;
  databaseUrl: string
  port: number
  caching: {
    redis: CachingConfig
  }
  jwt: {
    secret: string
    issuer: string
    expiresIn: number
  }
  authConfig: {
    lockTime: number
    retryAttempts: number
    allowMultiLoginDevices: boolean
  }
}
