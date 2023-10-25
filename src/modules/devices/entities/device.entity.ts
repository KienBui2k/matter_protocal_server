

import { UserDevive } from "src/modules/user_devive/entities/user_devive.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("devices")
export class Device {
   @PrimaryGeneratedColumn('uuid') 
   id:string


   @Column()
   name: string;

    // @Column()
    // user_device_id: string


   @Column()
   node_id: number; // number



    @Column()
    status: boolean

    @Column()

    power: number

    @Column({ default: false })
    isDeviceOn: boolean;

    @Column({ default: () => 'CURRENT_TIMESTAMP' }) // Sử dụng CURRENT_TIMESTAMP để tự động lưu thời gian hiện tại
    startTime: Date;

    @BeforeUpdate()
    async setUpdateTime() {
        this.startTime = new Date(); // Cập nhật thời gian mỗi khi entity được cập nhật
    }
    @OneToMany(() => Chart, (device) => device.device) // Sử dụng tên relation "timestamp" từ entity Device
    active:boolean

    @Column()
    power: number

    @ManyToOne(() => UserDevive, (userDevice => userDevice.id))
    @JoinColumn({ name: 'userDeviceId' })
    userDevice:UserDevive

}