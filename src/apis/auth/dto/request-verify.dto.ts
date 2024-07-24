import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RequestVerifyDto {
    @ApiProperty({ example: '01012345678' })
    @IsNotEmpty()
    phoneNumber: string;
}
