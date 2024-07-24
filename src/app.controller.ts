import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Checker')
@Controller()
export class AppController {
    @Get('/')
    getHello(): string {
        return '서버 작동 중';
    }
}
