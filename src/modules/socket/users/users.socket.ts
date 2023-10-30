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
import { Chart } from 'src/modules/chart/entities/chart.entity';
import { Permisstion } from 'src/modules/permisstion/entities/permisstion.entity';
import { UserRole } from 'src/modules/users/user.enum';


interface BindingDeviceType {
    binding: Binding;
    bindingDevice: Device;
}
interface deviceType {
    user: User;
    socket: Socket
}
@WebSocketGateway(3001, { cors: true })
export class UserSocketGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;
    clients: deviceType[] = [];
    bindingDevices: BindingDeviceType[] = [];

    constructor(
        private readonly jwt: JwtService,
        @InjectRepository(User) private readonly User: Repository<User>,
        @InjectRepository(Device) private readonly Device: Repository<Device>,
        @InjectRepository(Binding) private readonly Binding: Repository<Binding>,
        @InjectRepository(Chart) private readonly chartRespositoty: Repository<Chart>,
        @InjectRepository(UserDevice) private readonly UserDevive: Repository<UserDevice>,
        @InjectRepository(Permisstion) private readonly Permisstion: Repository<Permisstion>,

    ) { }


    onModuleInit() {
        this.server.on('connect', async (socket: Socket) => {
            console.log('Đã có người connect');
            /* Xóa người dùng khỏi clients nếu disconnect */
            socket.on('disconnect', () => {
                console.log('có 1 user đã out!');
                this.bindingDevices.splice(0, this.bindingDevices.length);
            });
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
                        for (let i = 0; i < binding.length; i++) {
                            let listId = binding[i].deviceId;
                            const parts = listId.split('+');
                            for (let j = 0; j <= parts.length - 1; j++) {
                                let tempDevice = await this.getDeviceById(parts[j]);
                                if (tempDevice) {
                                    this.bindingDevices.push({
                                        binding: binding[i],
                                        bindingDevice: tempDevice[0],
                                    });
                                }
                            }
                        }
                        socket.emit('receiveBinding', this.bindingDevices);
                        console.log('bindingDevices', this.bindingDevices);
                    }
                }
                let device;
                socket.on(
                    'addDevices',
                    async (newItem: { code: string; name: string; power: number }) => {
                        const WebSocket = require('ws');
                        const serverUrl = 'ws://192.168.1.41:5580/ws';
                        const socketIo = new WebSocket(serverUrl);
                        const param = getCommand(String(2), {
                            code: newItem.code,
                        });
                        await socketIo.on('open', async () => {
                            console.log('Đã kết nối tới cổng WebSocket', param);
                            socketIo.send(JSON.stringify(param));
                        });
                        socketIo.addEventListener('message', async (event) => {
                            const jsonData = JSON.parse(event.data.toString());
                            console.log('event', jsonData);

                            if (jsonData.result && jsonData.result.node_id) {
                                newItem.code = jsonData.result.node_id;
                                device = await this.addDevices(userDeviceId, newItem);
                                console.log('devicdw1123e', device);
                                // this.server.emit('receiveCart', device);
                                if (device) {
                                    socket.emit('receiveDevice', device);
                                }
                            }
                        });
                    },
                );
                socket.on('addBinding', async (data) => {
                    console.log('add Binding', data);
                    let bindingData = await this.addBinding(userDeviceId, data);
                    console.log('bindingData', bindingData);
                    if (bindingData) {
                        console.log('đã đủ dữ liệu để trả về!');
                        let listId = bindingData.deviceId;
                        const parts = listId.split('+');
                        console.log('parts', parts);

                        for (let i = 0; i < parts.length; i++) {
                            let tempDevice = await this.getDeviceById(parts[i]);
                            console.log('tempDevice', tempDevice);

                            if (tempDevice) {
                                this.bindingDevices.push({
                                    binding: bindingData,
                                    bindingDevice: tempDevice[0],
                                });
                            }
                        }
                        socket.emit('receiveBinding', this.bindingDevices);
                        console.log('test 2', this.bindingDevices);
                    }
                });
                let listuser = await this.listUser()
                if (listuser) {
                    console.log("listuser", listuser);
                    socket.emit('listUser', listuser)
                }
                socket.on('addRole', async (newRole: { userId: string, role: UserRole }) => {
                    console.log('add Binding', newRole);
                    let bindingData = await this.updateRole(newRole);
                    socket.emit('listUser', bindingData)

                });
            }

        })
    }

    async getUerDevice(id: string) {
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
            if (!UserDeviceId) {
                // kiểm tra nếu đã có userDevice thì trả về, nếu chưa có thì tạo mới

                const newDevice = this.UserDevive.create({ userId: id, email: oldUserDevice.email });
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
    async addDevices(
        userDeviceId: any,
        newItem: { code: string; name: string; power: number },
    ) {
        try {
            if (userDeviceId.role == "ADMIN") {
                let device = new Device();
                device.node_id = Number(newItem.code);
                device.name = newItem.name;
                device.power = newItem.power;
                device.userDevice = userDeviceId;
                await this.Device.save(device);
            }

            let data = await this.getDeviceByUserId(userDeviceId);
            return data;
        } catch (err) {
            console.error('Lỗi khi thêm thiết bị:', err);

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
    async addBinding(
        userDeviceId: any,
        data: {
            name: string;
            data: string;
        },
    ) {
        try {
            let newBinding = new Binding();
            newBinding.name = data.name;
            newBinding.UserDevice = userDeviceId;
            newBinding.deviceId = data.data;
            let bindingItem = await this.Binding.save(newBinding);
            if (!bindingItem) return false;
            return bindingItem;
        } catch (err) {
            return false;
        }
    }
    async chartById(id: any) {
        try {
            let listBinding = await this.chartRespositoty.find({
                where: {
                    device: id,
                },
            });
            if (!listBinding) return false;
            return listBinding;
        } catch (err) {
            return false;
        }

    }

    async permisstion(userDeviceId: any, newItem: { node_id: number, name: string }) {
        try {
            let permiss = new Permisstion();
            permiss.name = newItem.name;
            permiss.user_id = userDeviceId;
            permiss.node_id = newItem.node_id;
            let permissTion = await this.Binding.save(permiss);
            if (!permissTion) {
                return false;
            }
            return true
        } catch (err) {
            console.log("err", err);
            return false
        }
    }

    async updateRole(newRole: { userId: string, role: UserRole }) {
        try {
            let user = await this.UserDevive.findOne({ where: { id: newRole.userId } });
            if (!user) {
                return {
                    message: "User not known"
                }
            }
            user.role = newRole.role;
            await this.UserDevive.save(user)
            let users = await this.listUser()
            return users;
        } catch (err) {
            console.log("err", err);
            return false
        }
    }

    async listUser() {
        try {

            const users = await this.UserDevive.find({ where: { role: UserRole.MEMBER } });
            return users;
        } catch (err) {
            console.error('Lỗi khi lấy danh sách người dùng', err);
            throw err;
        }
    }
}
