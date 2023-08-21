import {Server} from "socket.io";
import {Server as HttpServer} from "http";
import {user} from "./src/types/user";
import {startListeners} from "./src/utils/utils";

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;
    public users: user;

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        });
        this.io.on('connect', (socket) => startListeners(this.io, socket, this.users));
    }
}