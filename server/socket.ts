import {Server} from "socket.io";
import {Server as HttpServer} from "http";
import {user} from "./src/types/user";
import {startListeners} from "./src/utils/utils";
//import {createServer, joinServer, startGame, leaveServer, move, moveSelectableColorCard, chat, getChat} from "./src/utils/api.cjs";
import {createServer, joinServer, startGame, leaveServer, move, moveSelectableColorCard, chat, getChat, isPlayerMaster, initGame} from "./src/utils/api";
import {getPlayer} from "./src/utils/playersSockets";
import {getAllServers, getServerPlayers, getServerByPlayerId, getServer} from "./src/utils/servers";

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
        this.io.on('connect', (socket) => {
            startListeners(this.io, socket, this.users);

            socket.on(
                "create-server",
                ({ serverName, player }, cb = () => {}) => {
                    try {
                        const io = this.io;
                        const serverId = createServer({ serverName });
                        joinServer({ serverId, io, player, socket, cb});
                    } catch (error) {
                        cb(error);
                        console.log(error);
                    }
                }
            );

            socket.on(
                "join-server",
                ({ serverId, player }, cb = () => {}) => {
                    try {
                        const io = this.io;
                        joinServer({ serverId, io, player, socket, cb });
                    } catch (error) {
                        cb(error);
                        console.log(error);
                    }
                }
            );

            socket.on("start-game", (_, cb = () => {}) => {
                try {
                    const io = this.io;
                    const { serverId } = getPlayer(socket.id);
                    startGame(serverId, io);
                } catch (err) {
                    cb(err);
                }
            });

            socket.on("move", ({ cardId, draw }, cb = () => {}) => {
                try {
                    const io = this.io;
                    move({ socket, cardId, draw }, io);
                    cb(null);
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

            socket.on("move-selectable-color-card", ({ cardId, draw, colorSelected }, cb = () => {}) => {
                try {
                    const io = this.io;
                    moveSelectableColorCard({ socket, cardId, draw, colorSelected }, io);
                    cb(null);
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

            socket.on("chat", ({ message }, cb = () => { }) => {
                try {
                    chat({ socket, message });
                    cb(null);
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

            socket.on("leave-server", () => {
                leaveServer(socket, this.io);
            });

            socket.on("disconnect", () => {
                leaveServer(socket, this.io);
            });

            socket.on("get-servers", (_, cb = () => {}) => {
                try {
                    cb(null, getAllServers());
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

            socket.on("get-server", ({playerId}, cb = () => {}) => {
                try {
                    cb(null, getServerByPlayerId(playerId));
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

            socket.on("get-server-players", (_, cb = () => {}) => {
                try {
                    const { serverId } = getPlayer(socket.id);
                    cb(null, getServerPlayers(serverId));
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

            socket.on("get-chat", (_, cb = () => { }) => {
                try {
                    const { serverId } = getPlayer(socket.id);
                    cb(null, getChat(serverId));
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

            socket.on("is-player-master", (_, cb = () => { }) => {
                try {
                    const { playerId, serverId } = getPlayer(socket.id);
                    cb(null, isPlayerMaster(playerId, serverId));
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

            socket.on("play-again", (_, cb = () => { }) => {
                try {
                    console.log("Player requested to play again");
                    const io = this.io;
                    const { serverId } = getPlayer(socket.id);
                    const server = getServer(serverId);
                    initGame(server, io, true);
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

        });
    }
}