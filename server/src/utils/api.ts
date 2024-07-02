import GameServer from "./gameServer";
import { IGameServer, IPlayer } from "./interfaces";
import {getServer, setServer, deleteServer, isThereServer} from "./servers";
import {addPlayer, removePlayer, getPlayer, isTherePlayer} from "./playersSockets";
import { getCard } from "./cards";
import { Socket } from "socket.io";

export function createServer({ serverName }: { serverName: string }): string {
    if (serverName.trim().length < 2) throw new Error("Server Name too short");
    const server = new GameServer(serverName);
    const serverId = server.serverId;
    setServer(server);
    server.init();
    return serverId;
}

export function joinServer({
    serverId,
    io,
    player,
    socket,
    cb = () => {},
}: {
    serverId: string;
    io: any;
    player: IPlayer;
    socket: Socket;
    cb?: (error: Error | null, playerId?: string) => void;
}): void {
    const server = getServer(serverId);

    if (!server) throw new Error("Server Doesn't Exist");
    if (player.name.trim().length <= 1) throw new Error("Player Name too short");
    if (server.players.length >= 4 /* server.numberOfPlayers */) throw new Error("Server is Already full");

    let playerId;
    if (socket) {
        player.socketID = socket.id;
        socket.join(serverId);
        playerId = server.joinPlayer(player);
        addPlayer(socket.id, playerId, serverId);
    } else {
        playerId = server.joinPlayer(player);
    }

    cb(null, playerId);

    io.to(serverId).emit("players-changed", server.players);

    if (server.players.length === 4 /* server.numberOfPlayers */) {
        initGame(server, io);
    }
}

export function initGame(server: IGameServer, io: any, restart:boolean = false): void {
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
    }, 2000);
}

export function startGame(serverId: string, io: any): void {
    const server = getServer(serverId);
    if (!server.gameRunning) {
        server.gameRunning = true;
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
        console.info("API.CJS game finished");
        server.gameRunning = false;
        io.to(serverId).emit("finished-game", playersFinishingOrder);
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
    }
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
            deleteServer(serverId);
            socket.leave(serverId);
            io.to(serverId).emit("players-changed", server.players);
        }
    }
    /*  try {
        let connectedPlayers = 0;
         for (const player of server.players) {
             if (!player.disconnected) connectedPlayers++;
         }
         console.info("API.CJS leaveServer connectedPlayers

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
        console.error(`Server with ID ${serverId} not found`);
        return false;
    }
    
    if (!server.players || server.players.length === 0) {
        console.error(`No players found in server with ID ${serverId}`);
        return false;
    }
    
    return server.players[0].id === playerId;
}

