import { Controller, Global, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ApiTags } from '@nestjs/swagger';
import { AuthModule } from './auth';
import { TypedEventEmitter } from '../event-emitter/typed-event-emitter.class';

@ApiTags('App Spec')
@Controller()
class AppController {
  constructor() {}
}

@Global()
@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [TypedEventEmitter],
  exports: [TypedEventEmitter],
})
export class AppModule {}
