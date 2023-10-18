import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { JwtService } from "src/modules/jwt/jwt.service";


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


            }
        })
    }
}