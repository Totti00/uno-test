import {ServerInterface} from "./ServerInterface.ts";
import {Card, GameServer, Player} from "../utils/interfaces.ts";
import { socket } from "./socket";

export class Server implements ServerInterface {

    player?: Player;

    createServer(serverName: string): Promise<string> {
        return new Promise((res, rej) => {
            socket.emit(
                "create-server",
                { serverName, player: this.getPlayer() },
                (err: any, playerId: string) => {
                    if (err) return rej(err);
                    res(playerId);
                }
            );
        });
    }

    emitReady(): void {
        socket.emit("start-game");
    }

    leaveServer(): void {
        socket.emit("leave-server");
        this.removeAllListeners();
    }

    getPlayer(): Player {
        if (this.player) return this.player;
        this.player = {} as Player;
        this.player.name = localStorage.getItem("playerName") as string;
        return this.player;
    }

    getServerPlayers(): Promise<Player[]> {
        return new Promise((res, rej) => {
            socket.emit("get-server-players", null, (err: any, players: Player[]) => {
                if (err) return rej(err);
                res(players);
            });
        });
    }

    getServers(): Promise<GameServer[]> {
        return new Promise((res, rej) => {
            socket.emit("get-servers", null, (err: any, servers: GameServer[]) => {
                if (err) return rej(err);
                res(servers);
            });
        });
    }

    getServerByPlayerId(playerName: string): Promise<string> {
        return new Promise((res, rej) => {
            socket.emit("get-server", {playerName}, (err: any, serverName: string) => {
                if (err) return rej(err);
                res(serverName);
            });
        });
    }

    joinServer(serverId: string): Promise<string> {
        return new Promise((res, rej) => {
            socket.emit(
                "join-server",
                { serverId, player: this.getPlayer() },
                (err: any, playerId: string) => {
                    if (err) {
                        return rej(err);
                    }
                    res(playerId);
                }
            );
        });
    }

    move(draw: boolean | null, cardId: string): Promise<void> {
        return new Promise((res, rej) => {
            socket.emit("move", { cardId, draw }, (err: any) => {
                if (err) return rej(err);
                res();
            });
        });
    }

    onFinishGame(cb: (playersOrdered: Player[]) => void): () => void {
        socket.on("finished-game", cb);
        return () => socket.off("finished-game", cb);
    }

    removeAllListeners() {
        socket.removeAllListeners();
    }

    onGameInit(
        cb: (data: { players: Player[]; cards: Card[] }) => void
    ): () => void {
        socket.on("init-game", cb);
        return () => socket.off("init-game", cb);
    }

    onMove(
        cb: (data: {
            nxtPlayer: number;
            card: Card;
            draw?: number | undefined;
            cardsToDraw?: Card[] | undefined;
        }) => void
    ): () => void {
        socket.on("move", cb);
        return () => socket.off("move", cb);
    }

    onPlayerLeft(cb: () => void): () => void {
        socket.on("player-left", cb);
        return () => socket.off("player-left", cb);
    }

    onPlayersUpdated(cb: (players: Player[]) => void): () => void {
        socket.on("players-changed", cb);
        return () => socket.off("players-changed", cb);
    }

}