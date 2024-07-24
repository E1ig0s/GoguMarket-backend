import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneVerify } from './entities/phone-verify.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PhoneVerify])],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
