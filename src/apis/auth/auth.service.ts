import { Injectable } from '@nestjs/common';
import { PhoneVerify } from './entities/phone-verify.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthServiceRequestVerify, IAuthServiceVerifyPhone } from './interfaces/auth.interface';
import { sendTokenToSMS } from 'utils/phone';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PhoneVerify)
        private phoneVerifyRepository: Repository<PhoneVerify>,
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

    async verifyPhone({ phoneVerifyDto }: IAuthServiceVerifyPhone): Promise<boolean> {
        const { phoneNumber, verifyCode } = phoneVerifyDto;

        const existingVerification = await this.phoneVerifyRepository.findOne({ where: { phoneNumber } });

        if (existingVerification && existingVerification.expiredAt < new Date()) {
            throw new Error('인증번호가 만료되었습니다');
        }

        if (existingVerification && existingVerification.verifyCode === verifyCode) {
            return true;
        } else {
            return false;
        }
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
}
