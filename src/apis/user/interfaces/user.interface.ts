import { CreateUserDto } from '../dto/request/create-user.dto';
import { Express } from 'express';

export interface IUserServiceCreate {
    createUserDto: CreateUserDto;
    profileImage: Express.Multer.File | null;
}
