import { Server as HttpServer } from "http";
import { ServerSocket } from "../socket";
import { io as Client } from "socket.io-client";
import { IPlayer } from "../src/utils/interfaces";
import GameServer from "../src/utils/gameServer";

jest.mock('../src/utils/cards', () => ({
    getCards: require('../__mocks__/mockCards').mockCards,
}));

describe("ServerSocket", () => {
    let httpServer: HttpServer;
    let clientSocket: any;

    const player: IPlayer = {
        id: '', 
        name: 'Player 1', 
        seed: '1234', 
        socketID: 'socket123', 
        cards: [], 
        timeOutCount: 0, 
        isMaster: true 
    };

    beforeAll((done) => {
        httpServer = new HttpServer();
        ServerSocket.initialize(httpServer);
        httpServer.listen(() => {
            const port = (httpServer.address() as any).port;
            clientSocket = Client(`http://localhost:${port}`);
            clientSocket.on("connect", () => {
                done();
            });
        });
    });

    afterAll((done) => {
        clientSocket.close();
        httpServer.close(done);
    });

    it('should handle create-server event', async () => {
        const serverName = "Test Server";
        let plaId: string;

        try {
            const result = await new Promise<string>((resolve, reject) => {
                clientSocket.emit("create-server", { serverName, player }, (error: Error, playerId: string) => {
                    if (error) {
                        console.log("Error in callback:", error.message);
                        reject(error);
                    } else {
                        resolve(playerId);
                    }
                });
            });
            plaId = result;
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
        } catch (error) {
            console.log("Error in create-server event:", error);
            throw error;
        }

        try{
            const result: any = await new Promise((res, rej) => {
                clientSocket.emit("get-server", {playerId: plaId}, (err: any, server: string) => {
                    if (err) return rej(err);
                    res(server);
                });
            });
            expect(result).toBeDefined();
            expect(result).toBe("Test Server");
        }catch(error){
            console.log("Error in get-server event:", error);
            throw error;
        }

        // testing is-player-master event
        try{
            const result: any = await new Promise((res, rej) => {
                clientSocket.emit("is-player-master", {}, (err: any, isMaster: boolean) => {
                    if (err) return rej(err);
                    res(isMaster);
                });
            });
            expect(result).toBeDefined();
            expect(result).toBe(true);
        }catch(error){
            console.log("Error in is-player-master event:", error);
            throw error;
        }
    }, 20000);

    it('should handle get-server-players event', async () => { 
        try{
            const result: any = await new Promise((res, rej) => {
                clientSocket.emit("get-server-players", {}, (err: any, players: IPlayer[]) => {
                    if (err) return rej(err);
                    res(players);
                });
            });
            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(result[0].name).toBe("Player 1");
        }catch(error){
            console.log("Error in get-server-players event:", error);
            throw error;
        }
    });
     
    it('should handle join-server event with player name too short', async () => {
        let server: string;
        const play: IPlayer = { id: '', name: 'P', seed: '1234', socketID: 'socket123', cards: [], timeOutCount: 0, isMaster: false };

        try{
            const result: any = await new Promise((res, rej) => {
                clientSocket.emit("get-servers", null, (err: any, servers: GameServer[]) => {
                    if (err) return rej(err);
                    res(servers);
                });
            });
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            server = result[0].id;
        }catch(error){
            console.log("Error in get-servers event:", error);
            throw error;
        }
        
        try {
            await new Promise((resolve, reject) => {
                clientSocket.emit("join-server", { serverId: server, player: play }, (error: {message: string}, playerId: string) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(playerId);
                    }
                });
            });
            // Se arriviamo qui, il test deve fallire perché ci aspettavamo un errore
            throw new Error('Expected join-server to throw an error, but it did not.');
        } catch (error: any) {
            expect(error).toBeDefined();
            expect(error.message).toBe("Player Name too short");
        }
    });

    it('should handle join-server event', async () => {
        const serverName = "Test Server";
        let servers: string;
        let playersId: (string | any[])[] = [];

        const players: IPlayer[] = [
            { id: '', name: 'Player 2', seed: '1234', socketID: 'socket1', cards: [], timeOutCount: 0, isMaster: false },
            { id: '', name: 'Player 3', seed: '5678', socketID: 'socket2', cards: [], timeOutCount: 0, isMaster: false }
        ];

        try{
            const result: any = await new Promise((res, rej) => {
                clientSocket.emit("get-servers", null, (err: any, servers: GameServer[]) => {
                    if (err) return rej(err);
                    res(servers);
                });
            });
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            servers = result[0].id;
        }catch(error){
            console.log("Error in get-servers event:", error);
            throw error;
        }
        
        try{
            const res = await new Promise((resolve, reject) => {

                for (let i = 0; i < players.length; i++) {
                    clientSocket.emit("join-server", { serverId: servers, player: players[i] }, (error: Error, playerId: string) => {
                        if (error) {
                            console.log("Error in callback:", error);
                            reject(error);
                        } else {
                            playersId.push(playerId);
                            resolve(playerId);
                        }
                    });
                }
            });
            expect(playersId.length).toBe(2);
            expect(playersId[0].length).toBeGreaterThan(0);
            expect(playersId[1].length).toBeGreaterThan(0);

        }catch(error){
            console.log("Error in join-server event:", error);
            throw error;
        }
    }, 20000);

    it('should handle the full looby', async () => {
        const pla: IPlayer = { id: '', name: 'Player 4', seed: '1246', socketID: 'socket3', cards: [], timeOutCount: 0, isMaster: false };
        let servers: string;

        try{
            const result: any = await new Promise((res, rej) => {
                clientSocket.emit("get-servers", null, (err: any, servers: GameServer[]) => {
                    if (err) return rej(err);
                    res(servers);
                });
            });
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            servers = result[0].id;
        }catch(error){
            console.log("Error in get-servers event:", error);
            throw error;
        }

        try{
            const res = await new Promise<string>((resolve, reject) => {
                clientSocket.emit("join-server", { serverId: servers, player: pla }, (error: Error, playerId: string) => {
                    if (error) {
                        console.log("Error in callback:", error);
                        reject(error);
                    } else {
                        resolve(playerId);
                    }
                });
            });
            expect(res).toBeDefined();
            expect(res.length).toBeGreaterThan(0);

        }catch(error){
            console.log("Error in join-server event:", error);
            throw error;
        }
    }, 20000);

    it('should handle chat event', async () => {
        const message = "Hello World!";

        try{
            const result: any = await new Promise((res, rej) => {
                clientSocket.emit("chat", { message }, (err: any, chat: string) => {
                    if (err) return rej(err);
                    res(chat);
                });
            });
        }catch(error){
            console.log("Error in chat event:", error);
            throw error;
        }

        try{
            const result: any = await new Promise((res, rej) => {
                clientSocket.emit("get-chat", null, (err: any, chat: string) => {
                    if (err) return rej(err);
                    res(chat);
                });
            });
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toBe("Hello World!");
        }catch(error){
            console.log("Error in get-chat event:", error);
            throw error;
        }

    }, 20000);

    it('should handle leaving a server', (done) => {
        clientSocket.emit("leave-server");

        setTimeout(() => {
            clientSocket.emit("get-servers", null, (err: any, servers: { id: string; name: string; cntPlayers: string }[]) => {
                if (err) {
                    done(err);
                } else {
                    expect(err).toBeNull();
                    expect(servers).toBeDefined();
                    expect(servers[0].cntPlayers).toBe("3/4");
                    done();
                }
            });
        });
    }, 20000);
});