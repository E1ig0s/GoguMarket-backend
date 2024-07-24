import { Injectable } from '@nestjs/common';
import { IFilesServiceUpload } from './interfaces/file.interface';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
    async upload({ file }: IFilesServiceUpload): Promise<string> {
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID,
            keyFilename: process.env.GCP_STORAGE_KEYFILE,
        }).bucket(process.env.GCP_STORAGE_BUCKET);

        const filename = `${uuidv4()}_${file.filename}`;
        const fileUpload = storage.file(filename);

        await new Promise((resolve, reject) => {
            fileUpload.save(
                file.buffer,
                {
                    contentType: file.mimetype,
                },
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve('이미지 업로드 성공');
                    }
                },
            );
        });

        const publicURL = `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/${filename}`;
        return publicURL;
    }
}
