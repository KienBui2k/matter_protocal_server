// import { Device } from "src/modules/devices/entities/device.entity";
// import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

// @Entity("chart")
// export class Chart {
//     @PrimaryColumn('uuid')
//     id: string

//     @ManyToOne(() => Device, (device) => device.timestamp)
//     device: Device;

//     @Column({
//         default: String(Date.now())
//     })
//     createdAt: String;

//     @Column({
//         default: String(Date.now())
//     })
//     updatedAt: String;

//     @BeforeUpdate()
//     async setUpdateTime() {
//         this.updatedAt = String(Date.now());
//     }
// }


// device-usage.entity.ts

import { Device } from 'src/modules/devices/entities/device.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Chart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('timestamp')
    Date: Date;

    @Column('int')
    timestamp: number;

    @ManyToOne(() => Device, (device) => device.startTime)
    device: Device;
}
