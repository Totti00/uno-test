import { createSlice, PayloadAction, current} from "@reduxjs/toolkit";
import {Card, Player, canPlayCard, canPlayCardSelectableColor} from "./utils/interfaces.ts";
import { wrapMod } from "./utils/utile.ts";
import { isNullOrUndefined } from 'is-what';

interface StoreState {
    playerId: string;
    currentPlayer: number;
    nextPlayer: number;
    orderOffset: number;
    direction: number;
    tableStack: Card[];
    drawingStack: Card[];
    players: Player[];
    lastPlayerDrawed: boolean;
    inGame: boolean;
    inLobby: boolean;
    firstCard: Card;
    firstPlayer: number;
    colorSelected: string;
}

let cardLayoutIdIdx = 111;

function generateDrawingCards(cnt: number) {
    return Array(cnt)
        .fill(0)
        .map(() => ({ layoutId: `id_${cardLayoutIdIdx++}` }));
}

const initialState = {
    tableStack: [] as Card[],
    drawingStack: [] as Card[],
    inGame: false,
} as StoreState

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialState,
    reducers: {
        setPlayerId(state, action) {
            state.playerId = action.payload
        },
        init: (state, action) => {
            const {players, cards: startingCards} = action.payload;
            state.direction = 1;
            state.tableStack = [];
            state.lastPlayerDrawed = false;
            state.inGame = true;
            state.colorSelected = "";

            const playersFinal: Player[] = [];
            let myIdx = 0;

            while (myIdx < players.length) {
                if (players[myIdx].id === state.playerId) break;
                myIdx++;
            }

            for (let i = myIdx; i < players.length; i++) {
                playersFinal.push(players[i]);
            }
            state.currentPlayer = playersFinal.length % players.length;
            for (let i = 0; i < myIdx; i++) {
                playersFinal.push(players[i]);
            }

            let cardsToDistribute: Card[] = startingCards.map((c: Card) => ({
                ...c,
                layoutId: `id_${cardLayoutIdIdx++}`,
                rotationY: 0,
                forPlayer: 0,
            }));

            for (let i = 1; i < playersFinal.length; i++) {
                cardsToDistribute = cardsToDistribute.concat(
                    Array(startingCards.length)
                        .fill(0)
                        .map(() => ({
                            layoutId: `id_${cardLayoutIdIdx++}`,
                            forPlayer: i,
                        }))
                );
            }
            state.players = playersFinal;
            state.drawingStack = cardsToDistribute.concat(generateDrawingCards(20));
            state.orderOffset = myIdx;
        },

        ready(state) {
            state.players = state.players.map((player, idx) => {
                return {
                    ...player,
                    cards: state.drawingStack.filter((c) => c.forPlayer === idx).map((c: Card) => ({
                        ...c,
                        playable: (idx === state.nextPlayer) && canPlayCard(state.firstCard, c, false),
                    })),
                };
            });

            state.drawingStack = state.drawingStack.filter((c) => isNullOrUndefined(c.forPlayer));
        },

        stopGame(state) {
            state.inGame = false;
        },

        setInLobby(state, action) {
            state.inLobby = action.payload;
        },

        moveCard(state, action: PayloadAction<{
            nextPlayer: number;
            card?: Card;
            draw?: number;
            cardsToDraw?: Card[];
          }>) {
            let { nextPlayer} = action.payload;
            const { card, cardsToDraw = [], draw } = action.payload

            const currentPlayer = state.players[state.currentPlayer];

            //ricalcolo nextPlayer in relazione al curPlayer
            nextPlayer = wrapMod(nextPlayer - state.orderOffset, state.players.length);

            if (card?.action === "reverse") state.direction *= -1;

            if (draw) {
                state.players = state.players.map((p) => {
                    if (p.id === currentPlayer.id) {
                        let newCards = state.drawingStack.slice(0, draw);
                        if (currentPlayer.id === state.playerId && cardsToDraw) {
                            newCards = newCards.map((c, idx) => ({
                                ...c, ...cardsToDraw[idx], rotationY: 0,
                            }));
                        }
                        return {
                            ...p, cards: p.cards.concat(newCards),
                        };
                    }
                    return p;
                });
                state.drawingStack = state.drawingStack.slice(draw).concat(generateDrawingCards(draw));
                state.lastPlayerDrawed = true;
            }

            if (card) {
                state.colorSelected = "";
                let layoutId: string | undefined = "";
                let shouldFlip = false;
                if (currentPlayer.id !== state.playerId) {
                    layoutId = currentPlayer.cards[Math.floor(Math.random() * currentPlayer.cards.length)].layoutId;
                    shouldFlip = true;
                } else {
                    layoutId = currentPlayer.cards.find((c: Card) => c._id === card?._id)?.layoutId;
                    const cardToMove = currentPlayer.cards.filter((c: Card) => c.layoutId === layoutId)[0];
                    console.log(layoutId, current(cardToMove));

                    card.color = cardToMove.color;
                    card.digit = cardToMove.digit;
                    card.action = cardToMove.action;
                }

                state.tableStack = [...state.tableStack.slice(-1), {
                    layoutId,
                    color: card.color,
                    digit: card.digit,
                    action: card.action,
                    flip: shouldFlip,
                    rotationY: 0,
                },];
                state.players = state.players.map((p) => {
                    if (p === currentPlayer) {
                        return {
                            ...p,
                            cards: p.cards.filter((c: Card) => c.layoutId !== layoutId),
                        };
                    }
                    return p;
                });
                state.lastPlayerDrawed = false;
            }
            state.nextPlayer = nextPlayer;
        },

        movePlayer(state) {
            state.players = state.players.map((player) => {
                if (player.id === state.playerId) {
                    const myTurn = state.nextPlayer === 0;
                    
                    return {
                        ...player,
                        cards: player.cards.map((card: Card) => {
                            return {
                                ...card,
                                //playable: myTurn && canPlayCard(state.tableStack[state.tableStack.length - 1], card, state.lastPlayerDrawed),
                                playable: myTurn && (state.colorSelected !== "" ? canPlayCardSelectableColor(state.colorSelected,state.tableStack[state.tableStack.length - 1], card, state.lastPlayerDrawed) : canPlayCard(state.tableStack[state.tableStack.length - 1], card, state.lastPlayerDrawed)),
                            };
                        }),
                    };
                }
                return player;
            });
            state.currentPlayer = state.nextPlayer;
        },
        movePlayerSelectableCard(state, action: PayloadAction<{
            color: string;
        }>) {
            const { color } = action.payload;
            state.colorSelected = color;
            state.players = state.players.map((player) => {
                if (player.id === state.playerId) {
                    const myTurn = state.nextPlayer === 0;

                    return {
                        ...player,
                        cards: player.cards.map((card: Card) => {
                            return {
                                ...card,
                                playable: myTurn && canPlayCardSelectableColor(color, state.tableStack[state.tableStack.length - 1], card, state.lastPlayerDrawed),
                            };
                        }),
                    };
                }
                return player;
            });
            state.currentPlayer = state.nextPlayer;
        },

        setFirstCard(state, action: PayloadAction<{
            firstCard: Card;
            firstPlayer: number;
        }>) {
            const { firstCard, firstPlayer } = action.payload;
            state.firstCard = firstCard;
            state.firstPlayer = firstPlayer;
        },
        moveFirstCard(state, action: PayloadAction<{
            nextPlayer: number;
            card: Card;
        }>) {
            let { nextPlayer} = action.payload;
            const { card} = action.payload;

            //ricalcolo nextPlayer in relazione al curPlayer
            nextPlayer = wrapMod(nextPlayer - state.orderOffset, state.players.length);

            if (card.action === "reverse") state.direction *= -1;

            let layoutId: string | undefined = "";
            let shouldFlip = false;
                
            layoutId = card.layoutId;
            shouldFlip = true;

            state.tableStack = [...state.tableStack.slice(-1), {
                layoutId,
                color: card.color,
                digit: card.digit,
                action: card.action,
                flip: shouldFlip,
                rotationY: 0,
            },];
            
            state.lastPlayerDrawed = false;
            state.nextPlayer = nextPlayer;
        },
    },
});

export const {
    init,
    ready,
    stopGame,
    moveCard,
    movePlayer,
    movePlayerSelectableCard,
    setPlayerId,
    setInLobby,
    setFirstCard,
    moveFirstCard,
} = gameSlice.actions;

export default gameSlice.reducer;



const initState = {
    cards: [],
}

const userState = {
    name: "",
}

export const fillCards = createSlice({
    name: 'cards',
    initialState: initState,
    reducers: {
        updateCards: (state, action) => {
            state.cards = action.payload;
        }
    },
})

export const userName = createSlice({
    name: 'user',
    initialState: userState,
    reducers: {
        updateUserName: (state, action) => {
            state.name = action.payload
        }
    },
})

export const { updateCards } = fillCards.actions
export const { updateUserName } = userName.actions