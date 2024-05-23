import {MiddlewareConsumer, Module} from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import configuration from '@config/configuration';
import { PrismaModule } from "@common/prisma";
import {SharedModule} from "@modules/shared";
import {AuthModule, AuthorizeGuard} from "@modules/auth";
import {CacheModule} from "@modules/cache";
import {ScopeVariableMiddleware} from "@common/middlewares";
import {UserModule} from "@modules/user/user.module";
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    SharedModule,
    PrismaModule,
    CacheModule,
    UserModule,

  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizeGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(ScopeVariableMiddleware)
        .forRoutes('*')
  }
}