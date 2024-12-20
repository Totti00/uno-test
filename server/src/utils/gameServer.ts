import {shuffle, wrapMod} from "./helpers";
import {ICard, IGameServer, IMoveEvent, IPlayer} from "./interfaces";
import {getCards} from "./cards";
import {nanoid} from "nanoid";
import {v4 as uuidv4} from "uuid";

export default class GameServer implements IGameServer {
    lobbyId = nanoid();
    lobbyName;
    players: IPlayer[] = [];
    curPlayer = 0;
    direction: 1 | -1 = 1;
    tableStk: ICard[] = [];
    drawingStk: ICard[] = [];
    sumDrawing = 0;
    deck: [] = [];
    gameRunning = false;
    lastPlayerDrew = false;
    playersFinished: number[] = [];
    messages: string[] = [];
    lastPlayerUNO = false;
    lastPlayer = 0;
    private timer: NodeJS.Timeout | null = null;

    constructor(serverName: string, /* numberOfPlayers = 4 */) {
        this.lobbyName = serverName;
    }

    async init() {
        this.players = [];
        this.curPlayer = 0;
        this.direction = 1;
        this.tableStk = [];
        this.drawingStk = [];
        this.sumDrawing = 0;
        this.playersFinished = [];
        this.lastPlayerDrew = false;
        this.deck = await getCards();
        this.messages = [];
        this.timer = null;
        this.lastPlayer = 0;
    }

    joinPlayer(player: IPlayer) {
        const playerId = uuidv4();
        const isMaster = this.players.length == 0

        this.players.push({
            ...player,
            id: playerId,
            cards: [],
            timeOutCount: 0,
            isMaster: isMaster,
        });
        return playerId;
    }

    leavePlayer(playerId: string) {
        if (!this.gameRunning) this.players = this.players.filter((p) => p.id !== playerId);
        else {
            const player = this.players.find((p) => p.id === playerId);
        }
    }

    start() {
        shuffle(this.deck);
        shuffle(this.players);
        const NUM_CARDS = 7;
        this.players.forEach((player, idx) => {
            player.cards = this.deck.slice(idx * NUM_CARDS, (idx + 1) * NUM_CARDS) as ICard[];
        });
        let firstCard;
        do {
            firstCard = this.deck.slice(NUM_CARDS * this.players.length, NUM_CARDS * this.players.length + 1)[0];
            if (this.checkNoFirstCard(firstCard)) {
                this.deck.push(firstCard);
                shuffle(this.deck);
            }
        } while (this.checkNoFirstCard(firstCard));
        this.drawingStk = this.deck.slice(this.players.length * NUM_CARDS + 1, this.deck.length) as ICard[];
        return this.move(false, firstCard);
    }

    async restart(){
        this.curPlayer = 0;
        this.direction = 1;
        this.tableStk = [];
        this.drawingStk = [];
        this.sumDrawing = 0;
        this.playersFinished = [];
        this.lastPlayerDrew = false;
        this.deck = await getCards();
        this.gameRunning = true;
        this.lastPlayerUNO = false;
        this.lastPlayer = 0;
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.players.forEach(player => {
            player.timeOutCount = 0;
        });
    }

    checkNoFirstCard(card: ICard) {
        return card.action === "draw4" || card.action === "wild" || card.action === "draw2" || card.action === "skip" || card.action === "reverse";
    }

    chat(message: string) {
        this.messages.push(message);
        return this.messages;
    }

    getChat() {
        return this.messages;
    }

    move(draw: boolean, card: ICard /* | null */) {
        let moveEventObj: IMoveEvent = {nxtPlayer: 0, curPlayer: 0, finish: false, playersFinishingOrder: [], oneCardLeft: false, lastPlayer: 0, drawn: false};

        if (draw) {
            this.handleDraw(moveEventObj);
        }

        let nxtPlayer = this.getNextPlayer(card);

        moveEventObj.curPlayer = this.curPlayer;
        moveEventObj.nxtPlayer = nxtPlayer;
        moveEventObj.lastPlayer = this.lastPlayer;

        if (card) {
            this.handleCardPlay(card, moveEventObj);
            this.lastPlayer = this.curPlayer;
            this.curPlayer = nxtPlayer;
        }

        return moveEventObj;
    }

    private handleDraw(moveEventObj: IMoveEvent): void {
        let drawCnt = 1;
        if (this.sumDrawing) {
            drawCnt = this.sumDrawing;
            this.sumDrawing = 0;
        }
    
        moveEventObj.draw = drawCnt;
        if (drawCnt + 1 > this.drawingStk.length) {
            this.drawingStk = shuffle(this.tableStk.slice(5, this.tableStk.length));
            this.tableStk = this.tableStk.slice(0, 5);
        }
    
        moveEventObj.cardsToDraw = this.drawingStk.slice(0, drawCnt);
        this.players[this.curPlayer].cards = this.drawingStk.slice(0, drawCnt).concat(this.players[this.curPlayer].cards);
        this.drawingStk = this.drawingStk.slice(drawCnt, this.drawingStk.length);
        this.lastPlayerDrew = true;
        moveEventObj.drawn = true;
    }

    private handleCardPlay(card: ICard, moveEventObj: IMoveEvent): void {
        if (card.action === "draw2") this.sumDrawing += 2;
        if (card.action === "draw4") this.sumDrawing += 4;
    
        this.tableStk.unshift(card); // Inserts the card on top of the stack
        moveEventObj.card = card;
    
        // Removes the just-played card from the player's hand
        this.players[this.curPlayer].cards = this.players[this.curPlayer].cards.filter((c) => c._id !== card._id);
        this.lastPlayerDrew = false;
    
        // Check if player has only one card left
        if (this.players[this.curPlayer].cards.length === 1) moveEventObj.oneCardLeft = true;
    
        // Check if game finished
        if (this.players[this.curPlayer].cards.length === 0) this.playersFinished.push(this.curPlayer);
        if (this.playersFinished.length === this.players.length - 1) {
            moveEventObj.finish = true;
            moveEventObj.playersFinishingOrder = this.finishGame();
        }
        moveEventObj.drawn = false;
    }

    getNextPlayer(card?: ICard) {
        let nxtPlayer = this.tableStk[0] ? this.curPlayer : wrapMod(this.curPlayer + this.direction, this.players.length);
        let remainingPlayers = this.players.length - this.playersFinished.length;

        this.checkReverse(card);

        if (remainingPlayers === 3) nxtPlayer = this.handleThreeRemainingPlayers(nxtPlayer, card);
        else if (remainingPlayers === 2) nxtPlayer = this.handleTwoRemainingPlayers(nxtPlayer, card);
        else nxtPlayer = this.handleOtherCases(nxtPlayer, card);

        return this.checkNextActivePlayers(nxtPlayer);
    }

    private handleThreeRemainingPlayers(nxtPlayer: number, card?: ICard) {
        if (card?.action === "skip") nxtPlayer = this.handleSkipAction(nxtPlayer);
        else nxtPlayer = wrapMod(nxtPlayer + this.direction, this.players.length);
        return nxtPlayer;
    }

    private handleTwoRemainingPlayers(nxtPlayer: number, card?: ICard) {
        if (card?.action !== "skip" && card?.action !== "reverse") nxtPlayer = wrapMod(nxtPlayer + this.direction, this.players.length);
        return nxtPlayer;
    }

    private handleOtherCases(nxtPlayer: number, card?: ICard) {
        if (card?.action === "skip") nxtPlayer = wrapMod(nxtPlayer + 2 * this.direction, this.players.length);
        else nxtPlayer = wrapMod(nxtPlayer + this.direction, this.players.length);
        return nxtPlayer;
    }

    private handleSkipAction(nxtPlayer: number) {
        const playerMap: {
            [key: number]: () => number;
        } = {
            0: () => {
                if (this.direction === -1) {
                    return nxtPlayer === 3 ? wrapMod(nxtPlayer * this.direction, this.players.length) :
                        wrapMod(nxtPlayer - this.direction, this.players.length);
                } else {
                    return nxtPlayer === 3 ? wrapMod(nxtPlayer + 3 * this.direction, this.players.length) :
                        wrapMod(nxtPlayer + 2 * this.direction, this.players.length);
                }
            },
            1: () => {
                if (this.direction === -1) {
                    return nxtPlayer === 0 ? wrapMod(nxtPlayer + 2 * this.direction, this.players.length) :
                        wrapMod(nxtPlayer - this.direction, this.players.length);
                } else {
                    return nxtPlayer === 2 ? wrapMod(nxtPlayer + 2 * this.direction, this.players.length) :
                        wrapMod(nxtPlayer + 3 * this.direction, this.players.length);
                }
            },
            2: () => {
                if (this.direction === -1) {
                    if (nxtPlayer === 0) {
                        return wrapMod(nxtPlayer + 3 * this.direction, this.players.length);
                    } else if (nxtPlayer === 3) {
                        return wrapMod(nxtPlayer - this.direction, this.players.length);
                    } else {
                        return wrapMod(nxtPlayer * this.direction, this.players.length);
                    }
                } else {
                    return nxtPlayer === 3 ? wrapMod(nxtPlayer + 2 * this.direction, this.players.length) :
                        wrapMod(nxtPlayer + 3 * this.direction, this.players.length);
                }
            },
            3: () => {
                if (this.direction === -1) {
                    if (nxtPlayer === 2) {
                        return wrapMod(nxtPlayer + 2 * this.direction, this.players.length);
                    } else if (nxtPlayer === 0) {
                        return wrapMod(nxtPlayer + 3 * this.direction, this.players.length);
                    } else {
                        return wrapMod(nxtPlayer - this.direction, this.players.length);
                    }
                } else {
                    return wrapMod(nxtPlayer + 2 * this.direction, this.players.length - 1);
                }
            }
        };

        const playerIndex = this.players.findIndex(player => player.cards.length === 0);
        return playerMap[playerIndex]();
    }

    private checkNextActivePlayers(nxtPlayer: number) {
        while (this.players[nxtPlayer].cards.length === 0) nxtPlayer = wrapMod(nxtPlayer + this.direction, this.players.length);
        return nxtPlayer;
    }

    private checkReverse(card?: ICard) {
        if (card?.action === "reverse") this.direction *= -1;
    }

    finishGame() {
        for (let i = 0; i <= 3; i++) if (!this.playersFinished.includes(i)) this.playersFinished.push(i);
        const playersFinishingOrder = this.playersFinished.map((idx) => this.players[idx]);
        return playersFinishingOrder;
    }

    resetTimer(timeoutSeconds: number, nxtPlayer: number, handleTimeOut: ({ nxtPlayer, serverId }: { nxtPlayer: number; serverId: string; }, io: any) => void, io:any) {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        // Set a new timer
        this.timer = setTimeout(() => {
            handleTimeOut({ nxtPlayer, serverId: this.lobbyId }, io);
        }, (timeoutSeconds + 1) * 1000);
    }

    playerDraw2(playerIndex: number) {
        if (this.drawingStk.length <= 2) {
            this.drawingStk = shuffle(this.tableStk.slice(5, this.tableStk.length));
            this.tableStk = this.tableStk.slice(0, 5);
        }

        let cardsToDraw = this.drawingStk.slice(0, 2);
        this.players[playerIndex].cards = this.drawingStk.slice(0, 2).concat(this.players[playerIndex].cards);
        this.drawingStk = this.drawingStk.slice(2, this.drawingStk.length);

        return cardsToDraw;
    }

    pass() {
        let nxtPlayer = this.getNextPlayer();
        this.lastPlayer = this.curPlayer;
        this.curPlayer = nxtPlayer;
        return nxtPlayer;
    }
}