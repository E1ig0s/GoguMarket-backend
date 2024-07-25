import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PhoneVerify } from './entities/phone-verify.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    IAuthServiceGetTokens,
    IAuthServiceRequestVerify,
    IAuthServiceRestoreAccessToken,
    IAuthServiceVerifyPhone,
} from './interfaces/auth.interface';
import { sendTokenToSMS } from 'utils/phone';
import { JwtService } from '@nestjs/jwt';
import { GetTokensDto } from './dto/response/get-tokens.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PhoneVerify)
        private phoneVerifyRepository: Repository<PhoneVerify>,
        private jwtService: JwtService,
    ) {}

    async requestVerify({ requestVerifyDto }: IAuthServiceRequestVerify): Promise<string> {
        const { phoneNumber } = requestVerifyDto;
        const existingVerification = await this.phoneVerifyRepository.findOne({ where: { phoneNumber } });

        const verifyCode = this.generateVerificationCode();
        const expiredAt = this.calculateExpiredAt();
        const updatedAt = new Date();

        if (existingVerification) {
            if (existingVerification.requestCount >= 5) {
                if (this.isRequestCountResetRequired(existingVerification.updatedAt)) {
                    existingVerification.requestCount = 1;
                } else {
                    throw new Error('하루 최대 인증번호 전송 횟수를 초과했습니다. (5회)');
                }
            } else {
                existingVerification.requestCount++;
            }
            await this.phoneVerifyRepository.save({
                requestCount: existingVerification.requestCount,
                phoneNumber,
                verifyCode,
                expiredAt,
                updatedAt,
            });
        } else {
            await this.phoneVerifyRepository.save({
                phoneNumber,
                verifyCode,
                expiredAt,
                requestCount: 1,
                updatedAt,
            });
        }

        sendTokenToSMS(phoneNumber, verifyCode);

        return '인증번호 전송 완료';
    }

    async verifyPhone({ phoneVerifyDto }: IAuthServiceVerifyPhone): Promise<GetTokensDto> {
        const { phoneNumber, verifyCode } = phoneVerifyDto;

        const existingVerification = await this.phoneVerifyRepository.findOne({ where: { phoneNumber } });

        if (!existingVerification) {
            throw new UnauthorizedException('핸드폰 번호가 존재하지 않습니다.');
        }

        if (existingVerification.expiredAt < new Date()) {
            throw new UnauthorizedException('인증번호가 만료되었습니다.');
        }

        if (existingVerification.verifyCode !== verifyCode) {
            throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
        }

        return this.getTokens({ phoneNumber });
    }

    private generateVerificationCode(): string {
        return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    }

    private calculateExpiredAt(): Date {
        const expirationMinutes = 5;
        return new Date(Date.now() + expirationMinutes * 60 * 1000);
    }

    private isRequestCountResetRequired(updatedAt: Date): boolean {
        const oneDay = 24 * 60 * 60 * 1000;
        const timeDiff = new Date().getTime() - updatedAt.getTime();
        return timeDiff >= oneDay;
    }

    getTokens({ phoneNumber }: IAuthServiceGetTokens): GetTokensDto {
        const accessToken = this.jwtService.sign({ sub: phoneNumber }, { secret: process.env.JWT_SECRET_ACCESS, expiresIn: '12h' });
        const refreshToken = this.jwtService.sign({ sub: phoneNumber }, { secret: process.env.JWT_SECRET_REFRESH, expiresIn: '180d' });
        return { accessToken, refreshToken };
    }

    restoreAccessToken({ phoneNumber }: IAuthServiceRestoreAccessToken): string {
        return this.jwtService.sign({ sub: phoneNumber }, { secret: process.env.JWT_SECRET_ACCESS, expiresIn: '12h' });
    }
}
