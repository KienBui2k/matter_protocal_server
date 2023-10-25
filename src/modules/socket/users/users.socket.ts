
import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { JwtService } from 'src/modules/jwt/jwt.service';
import { UserDevice } from 'src/modules/user_devive/entities/user_devive.entity';
import { Device } from 'src/modules/devices/entities/device.entity';
import { Binding } from 'src/modules/binding/entities/binding.entity';
import { getCommand } from "src/enum";


interface BindingDeviceType {
    binding: Binding;
    bindingDevice: Device;
}
@WebSocketGateway(3001, { cors: true })
export class UserSocketGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    bindingDevices: BindingDeviceType[] = [];

    constructor(
        private readonly jwt: JwtService,
        @InjectRepository(User) private readonly User: Repository<User>,
        @InjectRepository(Device) private readonly Device: Repository<Device>,
        @InjectRepository(Binding) private readonly Binding: Repository<Binding>,
        @InjectRepository(UserDevice)
        private readonly UserDevive: Repository<UserDevice>,
    ) { }



    onModuleInit() {
        this.server.on("connect", async (socket: Socket) => {
            console.log("Đã có người connect")
            /* Xóa người dùng khỏi clients nếu disconnect */
            socket.on("disconnect", () => {
                console.log("có 1 user đã out!")
                this.bindingDevices.splice(0, this.bindingDevices.length);
            })
            /* Xác thực người dùng */
            let token: string = String(socket.handshake.query.token);
            let user = this.jwt.verifyToken(token) as User;

            if (token == 'undefined' || !user) {
                socket.emit('connectStatus', {
                    message: 'Đăng nhập thất bại',
                    status: false,
                });
                socket.disconnect();
            } else {
                socket.emit('connectStatus', {
                    message: 'Đăng nhập thành công',
                    status: true,
                });
                socket.emit('receiveUserData', user);
                let userDeviceId = await this.getUerDevice(user.id);
                if (userDeviceId) {
                    let userdevice = await this.getDeviceByUserId(userDeviceId);
                    if (userdevice) {
                        socket.emit('receiveDevice', userdevice);
                    }
                    let binding = await this.getBindingDeviceByUserId(userDeviceId);
                    console.log('binding', binding);
                    if (binding && binding.length > 0) {
                        let listId = binding[0].deviceId;
                        const parts = listId.split('+');
                        for (let i = 0; i <= parts.length - 1; i++) {
                            let tempDevice = await this.getDeviceById(parts[i]);
                            if (tempDevice) {
                                this.bindingDevices.push({
                                    binding: binding[0],
                                    bindingDevice: tempDevice[0],
                                });
                            }
                        }
                        socket.emit("receiveBinding", this.bindingDevices)
                    }
                }
                let device
                socket.on("addDevices", async (newItem: { code: string, name: string, power: number }) => {
                const WebSocket = require('ws');
                const serverUrl = 'ws://192.168.1.41:5580/ws';
                const socketIo = new WebSocket(serverUrl);
                const param = getCommand(String(2), {
                    code: newItem.code
                });
                await socketIo.on('open', async () => {
                    console.log('Đã kết nối tới cổng WebSocket', param);
                    socketIo.send(JSON.stringify(param));
                });
                socketIo.addEventListener('message', async (event) => {
                  
                    const jsonData = JSON.parse(event.data.toString());
                    console.log("event",jsonData);

                    if (jsonData.result && jsonData.result.node_id) {
                        newItem.code = jsonData.result.node_id
                            device = await this.addDevices(userDeviceId, newItem)
                        console.log("devicdw1123e", device);
                        // this.server.emit('receiveCart', device);
                        if (device) {       
                              socket.emit('receiveDevice', device);
                        }
                    }
                });
            })
            }
        });
    }
    async getUerDevice(id: string) {
        console.log('user id', id);
        try {
            let oldUserDevice = await this.User.findOne({
                where: {
                    id,
                },
                relations: {
                    userDevice: true,
                },
            });
            let UserDeviceId = oldUserDevice?.userDevice[0]?.userId;
            console.log('oldUserDevice', oldUserDevice?.userDevice[0]?.userId);

            if (!UserDeviceId) {
                // kiểm tra nếu đã có userDevice thì trả về, nếu chưa có thì tạo mới
                const newDevice = this.UserDevive.create({ userId: id });
                let newUserDevice = await this.UserDevive.save(newDevice);
                if (!newUserDevice) return false;
                return newUserDevice;
            }
            return oldUserDevice.userDevice[0];
        } catch (err) {
            console.log('err', err);
            return false;
        }



    }
    async addDevices(userDeviceId: any, newItem: { code: string; name: string; power: number }) {
        try {
            console.log("newItem", newItem);
            let device = new Device()
            device.node_id = Number(newItem.code)
            device.name = newItem.name
            device.power = newItem.power
                device.userDevice = userDeviceId
            await this.Device.save(device);

            let data = await this.getDeviceByUserId(userDeviceId);
            return data;
        } catch (err) {
            console.error("Lỗi khi thêm thiết bị:", err);

            return false;
        }
    }


    async getDeviceByUserId(userDeviceId: any) {
        try {
            let listDevice = await this.Device.find({
                where: {
                    userDevice: userDeviceId,
                    active: true,
                },
            });
            if (!listDevice) return false;
            return listDevice;
        } catch (err) {
            return false;
        }
    }
    async getBindingDeviceByUserId(userDeviceId: any) {
        try {
            let listBinding = await this.Binding.find({
                where: {
                    UserDevice: userDeviceId,
                },
            });
            if (!listBinding) return false;
            return listBinding;
        } catch (err) {
            return false;
        }
    }

    async getDeviceById(deviceId: any) {
        try {
            let listDevice = await this.Device.find({
                where: {
                    id: deviceId,
                },
            });
            if (!listDevice) return false;
            return listDevice;
        } catch (err) {
            return false;
        }
    }
}

