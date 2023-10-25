import { OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { emit } from 'process';
import { async } from 'rxjs';
import { Server, Socket } from 'socket.io';
// import { Socket } from 'socket.io-client';
import { getCommand, Command } from 'src/enum';
import { Chart } from 'src/modules/chart/entities/chart.entity';
import { Device } from 'src/modules/devices/entities/device.entity';

import { Repository } from 'typeorm';

interface deviceType {
    decodedData: string;
}
@WebSocketGateway(3003, { cors: true })
export class ChartSocketGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    private devices: deviceType[] = [];

    constructor(
        @InjectRepository(Chart) private readonly chartRespositoty: Repository<Chart>,
        @InjectRepository(Device) private readonly Devices: Repository<Device>,
    ) { }

    onModuleInit() {
        this.server.on('connect', async (socket: Socket) => {
            const WebSocket = require('ws');
            const serverUrl = 'ws://192.168.1.41:5580/ws';
            const socketIo = new WebSocket(serverUrl);
            const param = getCommand(String(4));

            await socketIo.on('open', async () => {
                console.log('Connected to WebSocket gateway');
                socketIo.send(JSON.stringify(param));
            });

            socketIo.addEventListener('message', (event) => {
                const jsonData = JSON.parse(event.data.toString());
                if (Array.isArray(jsonData.data)) {
                    const status = jsonData.data.find((item) => typeof item === 'boolean');
                    const node_id = jsonData.data.find((item) => typeof item === 'number');

                    this.createUsageRecord(node_id, status);

                    if (status !== undefined) {
                        console.log('Giá trị boolean từ jsonData.data:', status);
                    } else {
                        console.log('Không tìm thấy giá trị boolean trong jsonData.data');
                    }
                } else {
                    console.log('jsonData.data không phải là một mảng.');
                }
            });

        });
    }
    async createUsageRecord(deviceId: number, status: boolean): Promise<Chart | null> {
        console.log("deviceId", deviceId, status);

        const existingDevice = await this.Devices.findOne({ where: { node_id: deviceId } });

        if (existingDevice) {
            if (status == true) {

                // Nếu trạng thái là true, đánh dấu thiết bị đang hoạt động.
                existingDevice.isDeviceOn = true;
                existingDevice.startTime = new Date();
                await this.Devices.save(existingDevice);

                return null;
            } else {
                const currentTime = new Date();
                const elapsedTime = this.calculateElapsedTime(currentTime, existingDevice.startTime);

                existingDevice.isDeviceOn = false;
                await this.Devices.save(existingDevice);

                return this.createUsageRecordEntry(deviceId, elapsedTime);
            }
        } else {
            // Nếu không có bản ghi cho thiết bị này, tạo một bản ghi mới.
            return this.createUsageRecordEntry(deviceId, 0);
        }
    }

    private calculateElapsedTime(currentTime: Date, startTime: Date): number {
        return (currentTime.getTime() - startTime.getTime()) / 1000;
    }

    private async createUsageRecordEntry(deviceId: number, elapsedTime: number): Promise<Chart> {
        const record = new Chart();
        record.timestamp = elapsedTime;
        record.Date = new Date();
        const device = await this.Devices.findOneOrFail({ where: { node_id: deviceId } });
        record.device = device;

        return this.chartRespositoty.save(record);

    }
}
