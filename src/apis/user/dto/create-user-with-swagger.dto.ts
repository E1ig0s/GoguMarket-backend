import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserWithSwaggerDto {
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

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    profileImage: Express.Multer.File | null;
}
