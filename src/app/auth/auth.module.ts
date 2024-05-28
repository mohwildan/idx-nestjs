import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { UsersModule } from '../users';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdminModule } from '../admin';
import { CompanyModule } from '../company';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AdminModule),
    forwardRef(() => CompanyModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.REDIS,
        options: {
          port: 6379,
          host: 'localhost',
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
