import {shuffle, wrapMod} from "./helpers";
import {ICard, IGameServer, IMoveEvent, IPlayer} from "./interfaces";
import {getCards} from "./cards";
import {nanoid} from "nanoid";
import {v4 as uuidv4} from "uuid";

export default class GameServer implements IGameServer {
    serverId = nanoid();
    serverName;
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

    constructor(serverName: string, /* numberOfPlayers = 4 */) {
        this.serverName = serverName;
        //this.numberOfPlayers = numberOfPlayers;
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
    }

    joinPlayer(player: IPlayer) {
        const playerId = uuidv4();

        this.players.push({
            ...player,
            id: playerId, //(this.players.length + 1).toString(),
            cards: [],
        });
        return playerId; //this.players.length.toString();
    }

    leavePlayer(playerId: string) {
        if (!this.gameRunning) this.players = this.players.filter((p) => p.id !== playerId);
        else {
            const player = this.players.find((p) => p.id === playerId);
            if (player !== undefined) player.disconnected = true;
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
        let moveEventObj: IMoveEvent = {nxtPlayer: 0, curPlayer: 0, finish: false, playersFinishingOrder: []};

        //controllo che la carta può essere giocata sulla cima dello stack
        //if (card && !canPlayCard(this.tableStk[0], card, this.lastPlayerDrew)) return false;

        if (draw) {
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
        }

        let nxtPlayer = this.getNextPlayer(card);

        moveEventObj.curPlayer = this.curPlayer;
        moveEventObj.nxtPlayer = nxtPlayer;

        if (card) {
            if (card.action === "draw2") this.sumDrawing += 2;
            if (card.action === "draw4") this.sumDrawing += 4;

            this.tableStk.unshift(card); //Inserisce la carta in cima allo stack
            moveEventObj.card = card;

            //rimuove dalla mano del giocatore, la carta appena giocata
            this.players[this.curPlayer].cards = this.players[this.curPlayer].cards.filter((c) => c._id !== card._id);
            this.lastPlayerDrew = false;

            // Check if game finished
            if (this.players[this.curPlayer].cards.length === 0) this.playersFinished.push(this.curPlayer);
            if (this.playersFinished.length === this.players.length - 1) {
                moveEventObj.finish = true;
                moveEventObj.playersFinishingOrder = this.finishGame();
                //this.finishGame();
            }
        }
        this.curPlayer = nxtPlayer;
        return moveEventObj;
        // this.fireEvent("move", moveEventObj as IMoveEvent);
    }

    getNextPlayer(card: ICard) {
        let nxtPlayer = this.tableStk[0] ? this.curPlayer : wrapMod(this.curPlayer + this.direction, this.players.length);
        let remainingPlayers = this.players.length - this.playersFinished.length;

        this.checkReverse(card);

        if (remainingPlayers === 3) nxtPlayer = this.handleThreeRemainingPlayers(card, nxtPlayer);
        else if (remainingPlayers === 2) nxtPlayer = this.handleTwoRemainingPlayers(card, nxtPlayer);
        else nxtPlayer = this.handleOtherCases(card, nxtPlayer);

        return this.checkNextActivePlayers(nxtPlayer);
    }

    handleThreeRemainingPlayers(card: ICard, nxtPlayer: number) {
        if (card?.action === "skip") nxtPlayer = this.handleSkipAction(nxtPlayer);
        else nxtPlayer = wrapMod(nxtPlayer + this.direction, this.players.length);
        return nxtPlayer;
    }

    handleTwoRemainingPlayers(card: ICard, nxtPlayer: number) {
        if (card?.action !== "skip" && card?.action !== "reverse") nxtPlayer = wrapMod(nxtPlayer + this.direction, this.players.length);
        return nxtPlayer;
    }

    handleOtherCases(card: ICard, nxtPlayer: number) {
        if (card?.action === "skip") nxtPlayer = wrapMod(nxtPlayer + 2 * this.direction, this.players.length);
        else nxtPlayer = wrapMod(nxtPlayer + this.direction, this.players.length);
        return nxtPlayer;
    }

    handleSkipAction(nxtPlayer: number) {
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
                    return nxtPlayer === 0 ? wrapMod(nxtPlayer + 3 * this.direction, this.players.length) :
                        nxtPlayer === 3 ? wrapMod(nxtPlayer - this.direction, this.players.length) :
                            wrapMod(nxtPlayer * this.direction, this.players.length);
                } else {
                    return nxtPlayer === 3 ? wrapMod(nxtPlayer + 2 * this.direction, this.players.length) :
                        wrapMod(nxtPlayer + 3 * this.direction, this.players.length);
                }
            },
            3: () => {
                if (this.direction === -1) {
                    return nxtPlayer === 2 ? wrapMod(nxtPlayer + 2 * this.direction, this.players.length) :
                        nxtPlayer === 0 ? wrapMod(nxtPlayer + 3 * this.direction, this.players.length) :
                            wrapMod(nxtPlayer - this.direction, this.players.length);
                } else {
                    return wrapMod(nxtPlayer + 2 * this.direction, this.players.length - 1);
                }
            }
        };

        const playerIndex = this.players.findIndex(player => player.cards.length === 0);
        return playerMap[playerIndex]();
    }

    checkNextActivePlayers(nxtPlayer: number) {
        while (this.players[nxtPlayer].cards.length === 0) nxtPlayer = wrapMod(nxtPlayer + this.direction, this.players.length);
        return nxtPlayer;
    }

    checkReverse(card: ICard) {
        if (card?.action === "reverse") this.direction *= -1;
    }

    finishGame() {
        for (let i = 0; i <= 3; i++) if (!this.playersFinished.includes(i)) this.playersFinished.push(i);
        const playersFinishingOrder = this.playersFinished.map((idx) => this.players[idx]);
        this.init();
        return playersFinishingOrder;
    }
}

export function canPlayCard(
    oldCard: ICard,
    newCard: ICard,
    lastPlayerDrew?: boolean
) {
    const isOldDawingCard = oldCard?.action && oldCard.action.indexOf("draw") !== -1;
    const haveToDraw = isOldDawingCard && !lastPlayerDrew;
    const isNewDawingCard = newCard?.action && newCard.action.indexOf("draw") !== -1;

    //No Card Played Yet
    if (!oldCard) return true;

    if (!haveToDraw && newCard.action === "wild") return true;

    if (newCard.action === "draw4") return true;

    if (oldCard.color === "black" && !haveToDraw) return true;

    if (haveToDraw && isNewDawingCard) return true;

    if (!haveToDraw && oldCard.color === newCard.color) return true;

    if (oldCard.action !== undefined && newCard.action !== undefined && oldCard.action === newCard.action) return true;

    return oldCard.digit !== undefined && oldCard.digit === newCard.digit;
}