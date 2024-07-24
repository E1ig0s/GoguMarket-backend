import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IUserServiceCreate } from './interfaces/user.interface';
import { FileService } from '../file/file.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly fileService: FileService,
        private readonly dataSource: DataSource,
    ) {}

    async create({ createUserDto, profileImage }: IUserServiceCreate): Promise<string> {
        const { phoneNumber } = createUserDto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');

        try {
            const existingUser = await queryRunner.manager.findOne(User, { where: { phoneNumber } });
            if (existingUser) {
                throw new BadRequestException('이미 등록된 번호입니다. 로그인해주세요.');
            }

            let profileImageUrl = null;
            if (profileImage) {
                profileImageUrl = await this.fileService.upload({ file: profileImage });
            } else {
                profileImageUrl = process.env.DEFAULT_USER_PROFILE_IMAGE;
            }

            const user = this.userRepository.create({ ...createUserDto, profileImage: profileImageUrl });
            await queryRunner.manager.save(user);

            await queryRunner.commitTransaction();

            return '회원가입 성공';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error instanceof BadRequestException ? error : new InternalServerErrorException('회원가입 중 오류가 발생했습니다.');
        } finally {
            await queryRunner.release();
        }
    }

    // findAll() {
    //     return `This action returns all user`;
    // }

    // findOne(id: number) {
    //     return `This action returns a #${id} user`;
    // }

    // update(id: number, updateUserDto: UpdateUserDto) {
    //     return `This action updates a #${id} user`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} user`;
    // }
}
