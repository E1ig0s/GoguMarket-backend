import { PhoneVerifyDto } from '../dto/phone-verify.dto';
import { RequestVerifyDto } from '../dto/request-verify.dto';

export interface IAuthServiceRequestVerify {
    requestVerifyDto: RequestVerifyDto;
}

export interface IAuthServiceVerifyPhone {
    phoneVerifyDto: PhoneVerifyDto;
}
