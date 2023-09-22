import {createSelector} from "reselect";
import {RootState} from "../../../store/store.ts";

/*
Utile per ottimizzare il selettore, ho creato un selettore memorizzato che restituisce lo stesso riferimento quando i dati 
sottostanti non sono cambiati. Così evito di ricalcolare la funzione di selezione se lo stato non è cambiato, il che può
causare re-renders non necessari nei componenti che utilizzano questo selettore.
*/

const gameSelector = (state: RootState) => state.game;

export const playerAndCurrPlayerStackSelector = createSelector(
    [gameSelector],
    (game) => ({
        player: game.players[0],
        currentPlayer: game.currentPlayer,
    })
);

export const playerAndCurrPlayerLeftStackSelector = createSelector(
    [gameSelector],
    (game) => ({
        player: game.players[1],
        currentPlayer: game.currentPlayer,
    })
);

export const playerAndCurrPlayerTopStackSelector = createSelector(
    [gameSelector],
    (game) => ({
        player: game.players[2],
        currentPlayer: game.currentPlayer,
    })
);

export const playerAndCurrPlayerRightStackSelector = createSelector(
    [gameSelector],
    (game) => ({
        player: game.players[3],
        currentPlayer: game.currentPlayer,
    })
);

export const tableStackSelector = createSelector(
    [gameSelector],
    (game) => ({
        tableStack: game.tableStack,
    })
);

export const drawingStackAndCurrentPlayerSelector = createSelector(
    [gameSelector],
    (game) => ({
        drawingStack: game.drawingStack,
        currentPlayer: game.currentPlayer,
    })
);