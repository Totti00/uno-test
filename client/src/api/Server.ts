import {ServerInterface} from "./ServerInterface.ts";
import {Card, GameServer, Message, Player} from "../utils/interfaces";
import { socket } from "./socket";

export class Server implements ServerInterface {
    player?: Player;

    createServer(serverName: string): Promise<string> {
        return new Promise((res, rej) => {
            socket.emit(
                "create-server",
                { serverName, player: this.getPlayer() },
                (err: any, playerId: string) => {
                    if (err) return rej(err instanceof Error ? err : new Error(err));
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
        this.player.color = localStorage.getItem("playerColor") as string;
        return this.player;
    }

    getServerPlayers(): Promise<Player[]> {
        return new Promise((res, rej) => {
            socket.emit("get-server-players", null, (err: any, players: Player[]) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
                res(players);
            });
        });
    }

    getChat(): Promise<Message[]> {
        return new Promise((res, rej) => {
            socket.emit("get-chat", null, (err: any, messages: Message[]) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
                res(messages);
            });
        });
    }

    getServers(): Promise<GameServer[]> {
        return new Promise((res, rej) => {
            socket.emit("get-servers", null, (err: any, servers: GameServer[]) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
                res(servers);
            });
        });
    }

    getServerByPlayerId(playerId: string): Promise<string> {
        return new Promise((res, rej) => {
            socket.emit("get-server", {playerId}, (err: any, serverName: string) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
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
                        return rej(err instanceof Error ? err : new Error(err));
                    }
                    res(playerId);
                }
            );
        });
    }

    move(draw: boolean | null, cardId: string): Promise<void> {
        return new Promise((res, rej) => {
            socket.emit("move", { cardId, draw }, (err: any) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
                res();
            });
        });
    }

    moveSelectableColorCard(draw: boolean | null, cardId: string, colorSelected: string): Promise<void> {
        return new Promise((res, rej) => {
            socket.emit("move-selectable-color-card", { cardId, draw, colorSelected }, (err: any) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
                res();
            });
        });
    }
    
    chat(message: Message): Promise<void>{
        return new Promise((res, rej) => {
            socket.emit("chat", { message }, (err: any) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
                res();
            });
        });
    }

    isPlayerMaster(): Promise<boolean> {
        return new Promise((res, rej) => {
            socket.emit("is-player-master", null , (err: any, isMaster: boolean) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
                res(isMaster);
            });
        });
    }

    playAgain(): Promise<void> {
        return new Promise((res, rej) => {
            socket.emit("play-again", null , (err: any) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
                res();
            });
        });
    }

    UNO(): Promise<void> {
        return new Promise((res, rej) => {
            socket.emit("uno", null , (err: any) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
                res();
            });
        });
    }

    PASS(): Promise<void> {
        return new Promise((res, rej) => {
            socket.emit("pass", null , (err: any) => {
                if (err) return rej(err instanceof Error ? err : new Error(err));
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
        cb: (data: { players: Player[]; cards: Card[]; card: Card; nxtPlayer: number; }) => void
    ): () => void {
        socket.on("init-game", cb);
        return () => socket.off("init-game", cb);
    }

    onMove(
        cb: (data: {
            nxtPlayer: number;
            card: Card;
            draw: number | undefined;
            cardsToDraw: Card[] | undefined;
        }) => void
    ): () => void {
        socket.on("move", cb);
        return () => socket.off("move", cb);
    }

    onMoveSelectableColorCard(
        cb: (data: {
            nxtPlayer: number;
            card: Card;
            draw: number | undefined;
            colorSelected: string;
            cardsToDraw: Card[] | undefined;
        }) => void
    ): () => void {
        socket.on("move-selectable-color-card", cb);
        return () => socket.off("move-selectable-color-card", cb);
    }

    onChat(
        cb: (data: {
            messages: Message[];
        }) => void
    ): () => void {
        socket.on("chat", cb);
        return () => socket.off("chat", cb);
    }

    onPlayerLeft(cb: () => void): () => void {
        socket.on("player-left", cb);
        return () => socket.off("player-left", cb);
    }

    onPlayersUpdated(cb: (players: Player[]) => void): () => void {
        socket.on("players-changed", cb);
        return () => socket.off("players-changed", cb);
    }

    onResetTimer(cb: (moveTime: number) => void): () => void{
        socket.on("reset-timer", cb);
        return () => socket.off("reset-timer", cb)
    }

    onTimeOut(cb: () => void): () => void {
        socket.on("time-out", cb);
        return () => socket.off("time-out", cb);
    }

    onForceLeave(cb: () => void): () => void {
        socket.on("force-leave", cb);
        return () => socket.off("force-leave", cb);
    }

    onShowUNO(cb: (showButton: boolean) => void): () => void{
        socket.on("show-uno", cb);
        return () => socket.off("show-uno", cb)
    }

    onShowPassButton(cb: (showButton: boolean) => void): () => void {
        socket.on("show-pass", cb);
        return () => socket.off("show-pass", cb);
    }

    onDraw2Cards(cb:(data:{lastPlayer:number; cardsToDrawLast?: Card[] }) => void): () => void {
        socket.on("draw-2-cards", cb);
        return () => socket.off("draw-2-cards", cb)
    }

    onFinalPlayerPass(cb: (nxtPlayer: number) => void): () => void {
        socket.on("final-player-pass", cb);
        return () => socket.off("final-player-pass", cb);
    }

}