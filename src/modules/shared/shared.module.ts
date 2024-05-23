import { Global, Module } from '@nestjs/common'
import {UserRepository} from "@modules/shared/repositories";

@Global()
@Module({
  providers: [
    UserRepository,
  ],
  exports: [
    UserRepository,
  ],
})
export class SharedModule {}
