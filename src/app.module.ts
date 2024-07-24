import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './apis/user/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { FileModule } from './apis/file/file.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        UserModule,
        FileModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_ROOT_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            entities: [__dirname + '/apis/**/*.entity.*'],
            synchronize: true,
            logging: true,
        }),
    ],
    controllers: [AppController],
})
export class AppModule {}
