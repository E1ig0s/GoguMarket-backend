import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @ApiProperty()
    @PrimaryColumn()
    phoneNumber: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ nullable: true })
    email: string | null;

    @ApiProperty()
    @Column()
    region: string;

    @ApiProperty()
    @Column()
    profileImage: string;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;
}
