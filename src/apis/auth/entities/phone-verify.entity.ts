import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PhoneVerify {
    @ApiProperty()
    @PrimaryColumn()
    phoneNumber: string;

    @ApiProperty()
    @Column()
    verifyCode: string;

    @ApiProperty()
    @Column()
    expiredAt: Date;

    @ApiProperty()
    @Column({ default: 0 })
    requestCount: number;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;
}
