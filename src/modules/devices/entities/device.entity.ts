// import { Chart } from "src/modules/chart/entities/chart.entity";
import { Chart } from "src/modules/chart/entities/chart.entity";
import { BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("devices")
export class Device {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string

    @Column({ default: null })
    user_device_id: string | null;

    @Column()
    node_id: number

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
    time: Chart;
}