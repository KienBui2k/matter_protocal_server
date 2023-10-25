import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { JwtService } from "src/modules/jwt/jwt.service";
import { Device } from "src/modules/devices/entities/device.entity";
import { getCommand } from "src/enum";


interface ClientType {
    user: User,
    socket: Socket
}
@WebSocketGateway(3001, { cors: true })
export class UserSocketGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server
    clients: ClientType[] = [];

    constructor(
        private readonly jwt: JwtService,
        @InjectRepository(Device) private readonly Devices: Repository<Device>,

    ) { }

    onModuleInit() {
        this.server.on("connect", async (socket: Socket) => {
            console.log("Đã có người connect")
            /* Xóa người dùng khỏi clients nếu disconnect */
            socket.on("disconnect", () => {
                console.log("có 1 user đã out!")
                this.clients = this.clients.filter(client => client.socket.id != socket.id)
            })

            /* Xác thực người dùng */
            let token: string = String(socket.handshake.query.token);
            let user = (this.jwt.verifyToken(token) as User);

            if (token == "undefined" || !user) {
                socket.emit("connectStatus", {
                    message: "Đăng nhập thất bại",
                    status: false
                })
                socket.disconnect();
            } else {
                this.clients.push({
                    socket,
                    user
                })

                socket.emit("connectStatus", {
                    message: "Đăng nhập thành công",
                    status: true
                })

                socket.emit("receiveUserData", user)


                let device

                socket.on("addDevices", async (newItem: { code: string, name: string, power: number }) => {
                    const WebSocket = require('ws');
                    const serverUrl = 'ws://21.240.175.42:5580/ws';
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
                        if (jsonData.result && jsonData.result.node_id) {
                            newItem.code = jsonData.result.node_id
                            device = await this.addDevices(newItem)
                        }

                    });
                    console.log("device", device);

                    if (device) {
                        for (let i in this.clients) {
                            this.clients[i].socket.emit('receiveDevice', device)
                        }
                    }
                })


            }
        })
    }
    async addDevices(newItem: { code: string; name: string; power: number }) {
        try {
            console.log("newItem", newItem);
            let device = new Device()
            device.node_id = Number(newItem.code)
            device.name = newItem.name
            device.power = newItem.power
            await this.Devices.save(device);

            let service = await this.Devices.findOne({
                where: {
                    node_id: Number(newItem.code),
                },
            });
            if (!service) return false;
            return service;
        } catch (err) {
            console.error("Lỗi khi thêm thiết bị:", err);
            return false;
        }
    }

}