import { configureStore } from '@reduxjs/toolkit';
import gameReducer, {
    init,
    ready,
    stopGame,
    initGame,
    moveCard,
    setPlayerId,
    setFirstCard,
    moveFirstCard,
} from '../../src/reducers.ts';
import { canPlayCard, Card, Player } from '../../src/utils/interfaces.ts';
import { isNullOrUndefined } from 'is-what';

const initialState = {
    playerId: '',
    currentPlayer: 0,
    nextPlayer: 0,
    orderOffset: 0,
    direction: 1,
    tableStack: [] as Card[],
    drawingStack: [] as Card[],
    players: [] as Player[],
    lastPlayerDrawed: false,
    inGame: false,
    inLobby: false,
    firstCard: {} as Card,
    firstPlayer: 0,
    colorSelected: ''
  };

describe('gameSlice reducer', () => {
    let store: any;

    beforeEach(() => {
        store = configureStore({ reducer: gameReducer });
    });

    it('should handle initial state', () => {
        expect(store.getState()).toEqual({
            tableStack: [] as Card[],
            drawingStack: [] as Card[],
            inGame: false,
        });
    });

    it('should handle setPlayerId', () => {
        store.dispatch(setPlayerId('player1'));
        expect(store.getState().playerId).toEqual('player1');
    });

    it('should handle init', () => {
        const players: Player[] = [
          { id: 'player1', name: 'Player 1', cards: [], color: 'red' },
          { id: 'player2', name: 'Player 2', cards: [], color: 'blue' },
        ];
        const cards: Card[] = [
          { _id: 'card1', color: 'red', digit: 1, action: undefined, layoutId: '1' },
          { _id: 'card2', color: 'blue', digit: 2, action: undefined, layoutId: '2' },
        ];
    
        store.dispatch(init({ players, cards }));
        expect(store.getState().players.length).toEqual(2);
        expect(store.getState().drawingStack.length).toBeGreaterThan(0);
        expect(store.getState().inGame).toBeTruthy();
    });

    it('should handle ready', () => {
        const players: Player[] = [
            { id: 'player1', name: 'Player 1', cards: [], color: 'red' },
            { id: 'player2', name: 'Player 2', cards: [], color: 'blue' },
        ];
        const cards: Card[] = [
            { _id: 'card1', layoutId: '1', color: 'red', digit: 1, action: 'skip' },
            { _id: 'card2', layoutId: '2', color: 'blue', digit: 2, action: 'reverse' },
        ];

        store.dispatch(setPlayerId('player1'));
        store.dispatch(init({ players, cards }));
        store.dispatch(ready());
        const state = store.getState();

        expect(state.players.length).toEqual(2);
        state.players.forEach((player: { cards: any[]; }, idx: any) => {
            expect(player.cards.length).toBeGreaterThan(0);
            player.cards.forEach(card => {
                expect(card.playable).toBe(idx === state.nextPlayer && canPlayCard(state.firstCard, card, false));
            });
        });
        expect(state.drawingStack.some((c: { forPlayer: unknown; }) => !isNullOrUndefined(c.forPlayer))).toBeFalsy();
    });

    it('should handle stopGame', () => {
        store.dispatch({ type: 'game/setState', payload: { ...initialState, inGame: true } });
        store.dispatch(stopGame());
        expect(store.getState().inGame).toBe(false);
    });

    it('should handle stopGame', () => {
        store.dispatch(stopGame());
        expect(store.getState().inGame).toBeFalsy();
    });

    it('should handle initGame', () => {
        store.dispatch(initGame());
        expect(store.getState().inGame).toBeTruthy();
    });

    it('should handle moveFirstCard', () => {
        // Definisci i dati iniziali
        const players: Player[] = [
            { id: 'player1', name: 'Player 1', cards: [], color: 'red' },
            { id: 'player2', name: 'Player 2', cards: [], color: 'blue' },
        ];

        const cards: Card[] = [
            { _id: 'card1', layoutId: '1', color: 'red', digit: 1, action: 'skip' },
            { _id: 'card2', layoutId: '2', color: 'blue', digit: 2, action: 'reverse' },
        ];

        // Step 1: Inizializza lo stato
        store.dispatch(init({ players, cards }));

        // Step 2: Effettua il "ready" per preparare lo stato
        store.dispatch(ready());

        // Step 3: Imposta la prima carta e il primo giocatore
        store.dispatch(setFirstCard({
            firstCard: cards[0],
            firstPlayer: 0
        }));

        // Prepara i payload per moveFirstCard
        const payload = {
            card: cards[0],
            nextPlayer: 1
        };

        // Step 4: Dispatch dell'azione moveFirstCard
        store.dispatch(moveFirstCard(payload));

        // Verifica lo stato aggiornato
        const state = store.getState();

        // Verifica che la carta sia stata aggiunta allo stack di disegno
        expect(state.tableStack).toContainEqual({layoutId: '1', color: 'red', digit: 1, action: 'skip', "rotationY": 0, "flip": true,});
    });

    it('should handle moveCard', () => {
        const players: Player[] = [
            { id: 'player1', name: 'Player 1', cards: [], color: 'red' },
            { id: 'player2', name: 'Player 2', cards: [], color: 'blue' },
        ];

        const cards: Card[] = [
            { _id: 'card1', layoutId: '1', color: 'red', digit: 1, action: undefined },
            { _id: 'card2', layoutId: '2', color: 'blue', digit: 2, action: 'reverse' },
        ];

        store.dispatch(setPlayerId('player1')); // Imposta playerId

        // Step 1: Inizializza lo stato
        store.dispatch(init({ players, cards }));

        // Step 2: Effettua il "ready" per preparare lo stato
        store.dispatch(ready());

        // Prepara i payload
        const payload = {
            nextPlayer: 1,
            card: cards[0],
            draw: undefined,
            cardsToDraw: undefined,
        };

        store.dispatch(moveCard(payload));

        const state = store.getState();

        // Verifica l'effetto delle azioni sullo stato
        expect(state.tableStack.length).toBeGreaterThan(0); // La carta dovrebbe essere aggiunta al tavolo
        expect(state.players[0].cards.length).toBe(1); // Il giocatore corrente dovrebbe avere una carta in meno
        expect(state.nextPlayer).toBe(payload.nextPlayer); // Verifica che il prossimo giocatore sia stato aggiornato
    });
});
