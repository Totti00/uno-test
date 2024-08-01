import GameServer from "./gameServer";
import { IGameServer, IPlayer } from "./interfaces";
import {getServer, setServer, deleteServer, isThereServer} from "./servers";
import {addPlayer, removePlayer, getPlayer, isTherePlayer} from "./playersSockets";
import { getCard } from "./cards";
import { Socket } from "socket.io";

const MOVE_TIME = 30; //time for each move in second

export async function createServer({ serverName }: { serverName: string }): Promise<string> {
    if (serverName.trim().length < 2) throw new Error("Server Name too short");
    const server = new GameServer(serverName);
    const serverId = server.serverId;
    setServer(server);
    await server.init();
    return serverId;
}

export async function joinServer({
    serverId,
    io,
    player,
    socket,
}: {
    serverId: string;
    io: any;
    player: IPlayer;
    socket: Socket;
}, cb: (error: Error | null, playerId?: string) => void): Promise<void> {
    const server = getServer(serverId);

    if (!server) {
        const error = new Error("Server Doesn't Exist");
        return cb(error);
    }
    if (player.name.trim().length <= 1) {  //DA controllare perche non abbiamo un tasto modifica nome giocatore
        const error = new Error("Player Name too short");
        return cb(error);
    }
    if (server.players.length >= 4 /* server.numberOfPlayers */) {
        const error = new Error("Server is Already full");
        return cb(error);
    }

    let playerId;

    if (socket) {
        player.socketID = socket.id;
        socket.join(serverId);
        playerId = server.joinPlayer(player);
        addPlayer(socket.id, playerId, serverId);
    } else {
        playerId = server.joinPlayer(player);
    }
    
    io.to(serverId).emit("players-changed", server.players);
    cb(null, playerId);

    if (server.players.length === 4 /* server.numberOfPlayers */) {
        await initGame(server, io);
    }
    
}

export async function initGame(server: IGameServer, io: any, restart:boolean = false): Promise<void> {
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            if(restart) server.restart();
            const { nxtPlayer, card } = server.start();

            const playersToSend = server.players.map((player) => ({
                ...player,
                cards: [], // just empty cards objects
            }));
            for (const player of server.players) {
                if (player.socketID) {
                    io.to(player.socketID).emit("init-game", {
                        players: playersToSend,
                        cards: player.cards,
                        nxtPlayer,
                        card,
                    });
                }
            }
            resolve();
        }, 2000);
    });
}

export function startGame(serverId: string, io: any): void {
    const server = getServer(serverId);
    if (!server.gameRunning) {
        server.gameRunning = true;

        const nxtPlayer = server.curPlayer;

        for (const player of server.players) {
            if (player.socketID) {
                io.to(player.socketID).emit("reset-timer", MOVE_TIME);
                server.resetTimer(MOVE_TIME, nxtPlayer, handleTimeOut, io);
            }
        }

        // if (
        //     server.players[server.curPlayer].disconnected ||
        //     server.players[server.curPlayer].isBot
        // ) {
        //     setTimeout(() => {
        //         moveBot(server);
        //     }, 1500);
        // }
        // server.onFinish((playersOrdered) => {
        //     io.to(serverId).emit("finished-game", playersOrdered);
        // });
    }
}

export function move({ socket, cardId, draw }: { socket: Socket; cardId: string; draw: boolean }, io: any): void {
    
    const { playerId, serverId } = getPlayer(socket.id);
    const server = getServer(serverId);
    const card = getCard(cardId);

    // Check if its my turn
    if (server.players[server.curPlayer].id !== playerId) throw new Error("Not Your Turn");

    // Make the move
    const {nxtPlayer, cardsToDraw, finish, playersFinishingOrder} = server.move(draw, card);

    //broadcast to all OTHER players
    socket.broadcast.to(serverId).emit("move", {
        nxtPlayer,
        card,
        draw: cardsToDraw?.length,
    });

    //send to my player
    socket.emit("move", {
        nxtPlayer,
        card,
        draw: cardsToDraw?.length,
        cardsToDraw,
    });

    if (finish) {
        server.gameRunning = false;
        io.to(serverId).emit("finished-game", playersFinishingOrder);
    } else {
        io.to(serverId).emit("reset-timer", MOVE_TIME);
        server.resetTimer(MOVE_TIME, nxtPlayer, handleTimeOut, io);
    }
}

export function moveSelectableColorCard(
    { socket, cardId, draw, colorSelected }: { socket: Socket; cardId: string; draw: boolean; colorSelected: string },
    io: any
): void {
    const { playerId, serverId } = getPlayer(socket.id);
    const server = getServer(serverId);
    const card = getCard(cardId);

    // Check if its my turn
    if (server.players[server.curPlayer].id !== playerId) throw new Error("Not Your Turn");

    // Make the move
    const { nxtPlayer, cardsToDraw, finish, playersFinishingOrder } = server.move(draw, card);

    //broadcast to all OTHER players
    socket.broadcast.to(serverId).emit("move-selectable-color-card", {
        nxtPlayer,
        card,
        draw: cardsToDraw?.length,
        colorSelected,
    });

    //send to my player
    socket.emit("move-selectable-color-card", {
        nxtPlayer,
        card,
        draw: cardsToDraw?.length,
        colorSelected,
        cardsToDraw,
    });

    if (finish) {
        console.info("API.CJS game finished");
        server.gameRunning = false;
        io.to(serverId).emit("finished-game", playersFinishingOrder);
    } else {
        io.to(serverId).emit("reset-timer", MOVE_TIME);
        server.resetTimer(MOVE_TIME, nxtPlayer, handleTimeOut, io);
    }
}

function handleTimeOut( {nxtPlayer, serverId} : {nxtPlayer: number; serverId: string}, io: any): void {
    const MAX_TIME_OUT = 3;
    const server = getServer(serverId);

    if((++server.players[nxtPlayer].timeOutCount) >= MAX_TIME_OUT){
        console.log("Too many time out");
        io.to(server.players[nxtPlayer].socketID).emit("force-leave");
    }
    else
        io.to(server.players[nxtPlayer].socketID).emit("time-out");
}

export function chat({ socket, message }: { socket: Socket; message: string }): void {
    const { serverId } = getPlayer(socket.id);
    const server = getServer(serverId);

    const messages = server.chat(message);

    //broadcast to other players
    socket.broadcast.to(serverId).emit("chat", {
        messages,
    });

    //broadcast to my player
    socket.emit("chat", {
        messages,
    });
}

export function getChat(serverId: string): string[] {
    const server = getServer(serverId);
    return server.getChat();
}

export function leaveServer(socket: Socket, io: any): void {

    if (isTherePlayer(socket.id)) {
        const player = getPlayer(socket.id);
        const { serverId} = player;

        if (isThereServer(serverId)) {
            const server = getServer(serverId);
            server.leavePlayer(player.playerId);
            socket.leave(serverId);
            removePlayer(socket.id);
            io.to(serverId).emit("players-changed", server.players);
            if (server.players.length === 0) deleteServer(serverId);
        }
    }
    /*  try {
        let connectedPlayers = 0;
         for (const player of server.players) {
             if (!player.disconnected) connectedPlayers++;
         }
         console.info("API.CJS leaveServer connectedPlayers", connectedPlayers);

        socket.leave(serverId);
        if (server.gameRunning) io.to(serverId).emit("player-left", playerId);
        else io.to(serverId).emit("players-changed", server.players);

        removePlayer(socket.id);
    } catch (error) {
        console.log(error);
    } */
}

export function isPlayerMaster(playerId: string, serverId: string): boolean { //true if the player created the lobby
    const server = getServer(serverId);

    if (!server) {
        return false;
    }
    
    if (!server.players || server.players.length === 0) {
        return false;
    }
    
    const player = server.players.find(player => player.id === playerId);
    if (player)
        return player.isMaster;
    else
        return false;
       
}

