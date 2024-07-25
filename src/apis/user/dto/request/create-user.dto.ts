import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: '고구마와 감자' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '회원2동' })
    @IsNotEmpty()
    region: string;

    @ApiProperty({ example: '01012345678' })
    @IsNotEmpty()
    phoneNumber: string;
}
