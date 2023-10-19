import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("devices")
export class Device {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   name: string;

   @Column()
   user_device_id: string;

   @Column()
   node_id: number; // number

   @Column()
   status: string;

   @Column()
   power: number; // number
}