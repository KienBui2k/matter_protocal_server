
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
    active:boolean

    @Column()
    power: number

    @ManyToOne(() => UserDevive, (userDevice => userDevice.id))
    @JoinColumn({ name: 'userDeviceId' })
    userDevice:UserDevive
}