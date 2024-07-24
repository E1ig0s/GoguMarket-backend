import { Controller, Post, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserWithSwaggerDto } from './dto/create-user-with-swagger.dto';
import { Express } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseInterceptors(FileInterceptor('profileImage'))
    @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateUserWithSwaggerDto })
    @ApiCreatedResponse({ description: '유저를 생성한다.' })
    create(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 800 * 1024, message: '파일 크기가 너무 큽니다.' }),
                    new FileTypeValidator({
                        fileType: ['image/jpeg', 'image/png', 'image/jpg'].join('|'),
                    }),
                ],
                fileIsRequired: false,
            }),
        )
        profileImage: Express.Multer.File | null,
    ) {
        return this.userService.create({ createUserDto, profileImage });
    }

    // @Get()
    // findAll() {
    //     return this.userService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.userService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.userService.update(+id, updateUserDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.userService.remove(+id);
    // }
}
