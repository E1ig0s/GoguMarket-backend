import { PhoneVerifyDto } from '../dto/request/phone-verify.dto';
import { RequestVerifyDto } from '../dto/request/request-verify.dto';

export interface IAuthServiceRequestVerify {
    requestVerifyDto: RequestVerifyDto;
}

export interface IAuthServiceVerifyPhone {
    phoneVerifyDto: PhoneVerifyDto;
}

export interface IAuthServiceGetTokens {
    phoneNumber: string;
}

export interface IAuthServiceRestoreAccessToken extends IAuthServiceGetTokens {}
