import { CreateUserDto } from '../dto/create-user.dto';
import { Express } from 'express';

export interface IUserServiceCreate {
    createUserDto: CreateUserDto;
    profileImage: Express.Multer.File | null;
}
