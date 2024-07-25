import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { string } from 'joi';
import { RequestVerifyDto } from './dto/request/request-verify.dto';
import { PhoneVerifyDto } from './dto/request/phone-verify.dto';
import { IRequest } from 'src/common/request/request';
import { AuthGuard } from '@nestjs/passport';
import { GetTokensDto } from './dto/response/get-tokens.dto';

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
    @ApiResponse({ status: 200, type: GetTokensDto, example: GetTokensDto })
    verifyPhone(@Body() phoneVerifyDto: PhoneVerifyDto): Promise<GetTokensDto> {
        return this.authService.verifyPhone({ phoneVerifyDto });
    }

    @Get('/restore-access-token')
    @ApiOperation({ summary: '엑세스 토큰 재발급 API', description: '엑세스 토큰을 재발급 한다.' })
    @ApiResponse({
        status: 200,
        type: string,
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
    @UseGuards(AuthGuard('refresh'))
    restoreAccessToken(@Req() req: IRequest): string {
        return this.authService.restoreAccessToken({ phoneNumber: req.phoneNumber });
    }
}
