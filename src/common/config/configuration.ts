import { ConfigFactory } from '@nestjs/config';
import { config } from 'dotenv';
import * as process from 'process';
import { Configuration } from './configuration.interface';

config();
const parseNumber = (input: string, defaultValue: number) => {
  const result = Number(input);
  return Number.isNaN(result) ? defaultValue : result
};
const configuration: Configuration = {
  env: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT) ?? 8080,
  databaseUrl: process.env.DATABASE_URL,
  caching: {
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: +process.env.REDIS_PORT ?? 6379,
      db: +process.env.REDIS_DB ?? 0,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    expiresIn: parseInt(process.env.JWT_EXPIRE_IN) ?? 3600,
  },
  authConfig: {
    lockTime: parseNumber(process.env.AUTH_LOCK_TIME, 3), // default 3 mins
    retryAttempts: parseNumber(process.env.AUTH_RETRY_ATTEMPTS, 5),
    allowMultiLoginDevices: /^true$/i.test(
        process.env.ALLOW_MULTI_LOGIN_DEVICE,
    ),
  },

} as const;
const configFunction: ConfigFactory<Configuration> = () => configuration;
export default configFunction
