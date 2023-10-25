import { User } from "src/modules/users/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users_device")
export class UserDevice {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, (user) => user.userDevice)
    user: User;


    @Column({ default: false })
    status: boolean;

    @Column()
    node_id: number;

    @Column({
        default: String(Date.now())
    })
    createdAt: String;
    
    @Column({
        default: String(Date.now())
    })
    updatedAt: String;

    @BeforeUpdate()
    async setUpdateTime() {
        this.updatedAt = String(Date.now());
    }
}
