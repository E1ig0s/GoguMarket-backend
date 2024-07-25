import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: '고구마와 감자' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '1234@example.com', nullable: true })
    @IsEmail()
    @IsOptional()
    email: string | null;

    @ApiProperty({ example: '회원2동' })
    @IsNotEmpty()
    region: string;

    @ApiProperty({ example: '01012345678' })
    @IsNotEmpty()
    phoneNumber: string;
}
