import { Express } from 'express';
export interface IFilesServiceUpload {
    file: Express.Multer.File;
}
