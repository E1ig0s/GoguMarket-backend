import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PhoneVerifyDto {
    @ApiProperty({ example: '01012345678' })
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    verifyCode: string;
}
