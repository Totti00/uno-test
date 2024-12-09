import {Player} from "../../utils/interfaces.ts";

/**
 * Funzione generica per calcolare il nome del giocatore a una certa distanza nell'ordine.
 * @param players Elenco dei giocatori.
 * @param steps Numero di posizioni da spostarsi nell'array dei giocatori.
 * @returns Il nome del giocatore successivo (o quello dopo x posizioni).
 */
const getPlayerAtPosition = (players: Player[], steps: number): string => {
    const myName = localStorage.getItem("playerName");
    // Trova l'indice del giocatore corrente
    const currentPlayerIndex = players.findIndex(player => player.name === myName);
    if (currentPlayerIndex === -1) {
        throw new Error("Il nome del giocatore corrente non è presente nell'elenco dei giocatori.");
    }
    // Calcola l'indice del giocatore a una certa distanza considerando l'ordine circolare
    const nextPlayerIndex = (currentPlayerIndex + steps) % players.length;

    // Ritorna il nome del giocatore
    return players[nextPlayerIndex].name;
}

/**
 * Funzione per calcolare il nome del prossimo giocatore nell'ordine.
 * @param players Elenco dei giocatori.
 * @returns Il nome del prossimo giocatore.
 */
export const getNextPlayerName = (players: Player[]): string => {
    return getPlayerAtPosition(players, 1);
}

/**
 * Funzione per calcolare il nome del secondo prossimo giocatore nell'ordine.
 * @param players Elenco dei giocatori.
 * @returns Il nome del secondo prossimo giocatore.
 */
export const getSecondNextPlayerName = (players: Player[]): string => {
    return getPlayerAtPosition(players, 2);
}

/**
 * Funzione per calcolare il nome del terzo prossimo giocatore nell'ordine.
 * @param players Elenco dei giocatori.
 * @returns Il nome del terzo prossimo giocatore.
 */
export const getThirdNextPlayerName = (players: Player[]): string => {
    return getPlayerAtPosition(players, 3);
}
