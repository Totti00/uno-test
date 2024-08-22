import GameServer from "../src/utils/gameServer";
import { IPlayer, ICard } from "../src/utils/interfaces";

jest.mock('../src/utils/cards', () => ({
    getCards: require('../__mocks__/mockCards').mockCards,
}));

describe('GameServer', () => {

    let gameServer: GameServer;

    const player: IPlayer = {
        id: '', 
        name: 'Player 1', 
        seed: '1234', 
        socketID: 'socket123', 
        cards: [], 
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
            timeOutCount: 0, 
            isMaster: false 
        };
        gameServer.joinPlayer(player);
        gameServer.joinPlayer(player2);
        const moveEvent = gameServer.start();
        expect(gameServer.players[0].cards.length).toBeGreaterThan(0);
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
