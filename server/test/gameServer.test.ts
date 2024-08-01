import GameServer from "../src/utils/gameServer";
import { IPlayer, ICard } from "../src/utils/interfaces";
import { shuffle, wrapMod } from "../src/utils/helpers";

jest.mock('../src/utils/cards', () => ({
    getCards: jest.fn(async () => [
      { _id: 'card1', layoutId: '1', color: 'red', digit: 1, action: undefined },
      { _id: 'card2', layoutId: '2', color: 'red', digit: 2, action: undefined },
      { _id: 'card3', layoutId: '3', color: 'red', digit: 3, action: undefined },
      { _id: 'card4', layoutId: '4', color: 'red', digit: 4, action: undefined },
      { _id: 'card5', layoutId: '5', color: 'blue', digit: 1, action: undefined },
      { _id: 'card6', layoutId: '6', color: 'blue', digit: 2, action: undefined },
      { _id: 'card7', layoutId: '7', color: 'blue', digit: 3, action: undefined },
      { _id: 'card8', layoutId: '8', color: 'blue', digit: 4, action: undefined },
      { _id: 'card9', layoutId: '9', color: 'yellow', digit: 1, action: undefined },
      { _id: 'card10', layoutId: '10', color: 'yellow', digit: 2, action: undefined },
      { _id: 'card11', layoutId: '11', color: 'green', digit: 3, action: undefined },
      { _id: 'card12', layoutId: '12', color: 'green', digit: 4, action: undefined },
      { _id: 'card13', layoutId: '13', color: 'green', digit: 5, action: undefined },
      { _id: 'card14', layoutId: '14', color: 'green', digit: 6, action: undefined },
      { _id: 'card15', layoutId: '15', color: 'green', digit: 7, action: undefined },
      { _id: 'card16', layoutId: '16', color: 'green', digit: 8, action: undefined },
      { _id: 'card17', layoutId: '17', color: 'red', digit: undefined, action: 'reverse' },
      { _id: 'card18', layoutId: '18', color: 'red', digit: undefined, action: 'skip' },
      { _id: 'card19', layoutId: '19', color: 'red', digit: undefined, action: 'draw2' },
    ]),
}));

describe('GameServer', () => {

    let gameServer: GameServer;

    const player: IPlayer = {
        id: '', 
        name: 'Player 1', 
        seed: '1234', 
        socketID: 'socket123', 
        cards: [], 
        disconnected: false, 
        timeOutCount: 0, 
        isMaster: false 
    };

    beforeEach(() => {
        gameServer = new GameServer('Test Server');
    });

    it('should initialize the game server', async () => {
        await gameServer.init();
        expect(gameServer.players).toEqual([]);
        expect(gameServer.curPlayer).toBe(0);
        expect(gameServer.direction).toBe(1);
        expect(gameServer.tableStk).toEqual([]);
        expect(gameServer.drawingStk).toEqual([]);
        expect(gameServer.sumDrawing).toBe(0);
        expect(gameServer.playersFinished).toEqual([]);
        expect(gameServer.lastPlayerDrew).toBe(false);
        expect(gameServer.deck.length).toBeGreaterThan(0);
        expect(gameServer.messages).toEqual([]);
    });

    it('should join a player', () => {
        const playerId = gameServer.joinPlayer(player);
        expect(gameServer.players.length).toBe(1);
        expect(gameServer.players[0].name).toBe('Player 1');
        expect(gameServer.players[0].id).toBe(playerId);
        expect(gameServer.players[0].isMaster).toBe(true);
    });

    it('should leave a player', () => {
        const playerId = gameServer.joinPlayer(player);
        gameServer.leavePlayer(playerId);
        expect(gameServer.players.length).toBe(0);
    });

    it('should start the game', async () => {
        await gameServer.init();
        const player2: IPlayer = {
            id: '', 
            name: 'Player 2', 
            seed: '5678', 
            socketID: 'socket456', 
            cards: [], 
            disconnected: false, 
            timeOutCount: 0, 
            isMaster: false 
        };
        gameServer.joinPlayer(player);
        gameServer.joinPlayer(player2);
        const moveEvent = gameServer.start();
        expect(gameServer.players[0].cards.length).toBeGreaterThan(6);
        expect(gameServer.players[1].cards.length).toBe(7);
        expect(gameServer.drawingStk.length).toBeGreaterThan(0);
        expect(moveEvent).toBeTruthy();
    });

    it('should handle chat messages', () => {
        gameServer.chat('Hello');
        gameServer.chat('World');
        const messages = gameServer.getChat();
        expect(messages).toEqual(['Hello', 'World']);
    });

    it('should handle a move correctly', async () => {
        await gameServer.init();
        gameServer.joinPlayer(player);
        gameServer.start();
        gameServer.sumDrawing = 2;

        const card: ICard = { _id: 'card1', color: 'red', digit: undefined, action: 'draw2' };
        const moveResult = gameServer.move(true, card);

        expect(moveResult.curPlayer).toBe(0);
        expect(gameServer.tableStk).toContain(card);
        expect(gameServer.players[0].cards).not.toContain(card);
    });

    it('should allow a player to leave when the game is running', async () => {
        await gameServer.init();
        const playerId = gameServer.joinPlayer(player);
        gameServer.start();
        gameServer.gameRunning = true;
        gameServer.leavePlayer(playerId);
        expect(gameServer.players.length).toBe(1);
    });

    it('should reset the game state correctly', async () => {
        gameServer.joinPlayer(player);
        await gameServer.restart();
        expect(gameServer.curPlayer).toBe(0);
        expect(gameServer.direction).toBe(1);
        expect(gameServer.tableStk).toEqual([]);
        expect(gameServer.drawingStk).toEqual([]);
        expect(gameServer.sumDrawing).toBe(0);
        expect(gameServer.playersFinished).toEqual([]);
        expect(gameServer.lastPlayerDrew).toBe(false);
        expect(gameServer.deck.length).toBeGreaterThan(1);
        expect(gameServer.gameRunning).toBe(true);
        gameServer.players.forEach(player => {
            expect(player.timeOutCount).toBe(0);
        });
    });
});
