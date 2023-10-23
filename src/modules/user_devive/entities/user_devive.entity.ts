import { Device } from "src/modules/devices/entities/device.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_device")
export class UserDevive {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user_id:User

    @OneToMany(() => Device, (device => device.id))
    devices:Device[]
}
