import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { string } from 'joi';
import { RequestVerifyDto } from './dto/request-verify.dto';
import { PhoneVerifyDto } from './dto/phone-verify.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/request-verify')
    @ApiOperation({ summary: '인증번호 발급 API', description: '인증번호를 발급한다.' })
    @ApiBody({ type: RequestVerifyDto })
    @ApiResponse({
        status: 201,
        type: string,
        example: '인증번호 전송 완료',
    })
    requestVerify(@Body() requestVerifyDto: RequestVerifyDto): Promise<string> {
        return this.authService.requestVerify({ requestVerifyDto });
    }

    @Post('/phone-verify')
    @ApiOperation({ summary: '인증번호 검증 API', description: '인증번호를 검증한다.' })
    @ApiBody({ type: PhoneVerifyDto })
    @ApiResponse({ status: 200, type: Boolean, example: true })
    async verifyPhone(@Body() phoneVerifyDto: PhoneVerifyDto): Promise<boolean> {
        return this.authService.verifyPhone({ phoneVerifyDto });
    }
}
