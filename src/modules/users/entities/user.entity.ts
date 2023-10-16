import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as  bcrypt from 'bcrypt'

@Entity("users")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true, length: 30 })
    userName: string;

    @Column({ default: "https://png.pngtree.com/png-clipart/20210608/ourmid/pngtree-gray-silhouette-avatar-png-image_3418406.jpg" })
    avatar: string;

    @Column({ unique: true, length: 150 })
    email: string;

    @Column({ default: false })
    emailAuthentication: boolean;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @Column({
        default: String(Date.now())
    })
    createAt: String;

    @Column({
        default: String(Date.now())
    })
    updateAt: String;
}
