import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("devices")
export class Device {
   @PrimaryColumn('uuid') 
   id:string

   @Column()
    name: string

    @Column()
    user_device_id: string

    @Column()
    node_id: number

    @Column()
    status: string

    @Column()
    power: number

}