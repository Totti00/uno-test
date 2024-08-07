import {Server} from "socket.io";
import {Server as HttpServer} from "http";
import {createServer, joinServer, startGame, leaveServer, move, moveSelectableColorCard, chat, getChat, isPlayerMaster, initGame, disableUNO} from "./src/utils/api";
import {getPlayer} from "./src/utils/playersSockets";
import {getAllServers, getServerPlayers, getServerByPlayerId, getServer} from "./src/utils/servers";

export class ServerSocket {
    private static _instance: ServerSocket | null = null;
    public io: Server;

    private constructor(server: HttpServer) {
        //ServerSocket._instance = this;
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
            socket.on(
                "create-server",
                async ({ serverName, player }, cb = () => {}) => {
                    try {
                        const io = this.io;
                        const serverId = await createServer({ serverName });
                        joinServer({ serverId, io, player, socket }, (error, playerId) => {
                            if (error) {
                                return cb({message: error.message});
                            }
                            cb(null, playerId);
                        });
                    } catch (error) {
                        cb(error);
                        console.log(error);
                    }
                }
            );

            socket.on(
                "join-server",
                ({ serverId, player }, cb = () => {}) => {
                    const io = this.io;
                    new Promise((resolve, reject) => {
                        joinServer({ serverId, io, player, socket }, (error, playerId) => {
                            if (error) {
                                return reject(error);
                            }
                            resolve(playerId);
                        });
                    })
                    .then(playerId => cb(null, playerId))
                    .catch(error => cb({ message: error.message }));
                }
            );

            socket.on("start-game", (_, cb = () => {}) => {
                try {
                    const io = this.io;
                    const { serverId } = getPlayer(socket.id);
                    startGame(serverId, io);
                    cb(null);
                } catch (err) {
                    console.log("Error in start-game event handler:", err);
                    cb(err);
                }
            });

            socket.on("move", ({ cardId, draw }, cb = () => {}) => {
                try {
                    const io = this.io;
                    move({ socket, cardId, draw }, io);
                    cb(null);
                } catch (error) {
                    console.log("Error in move event handler:", error);
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
                    const io = this.io;
                    const { serverId } = getPlayer(socket.id);
                    const server = getServer(serverId);
                    initGame(server, io, true);
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

            socket.on("uno", (_, cb = () => { }) => {
                try {
                    const { serverId } = getPlayer(socket.id);
                    disableUNO({socket, serverId});
                } catch (error) {
                    cb(error);
                    console.log(error);
                }
            });

        });
        
    }

    public static get instance(): ServerSocket | null {
        return this._instance;
    }

    public static initialize(server: HttpServer): ServerSocket {
        if (this._instance === null) {
            this._instance = new ServerSocket(server);
        }
        return this._instance;
    }
}