import { Global, Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { DatabaseModule } from './platform/database/database.module';
import { ServicesModule } from './services/services.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AppModule,
    DatabaseModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
  exports: [DatabaseModule],
})
export class MainModule {}
