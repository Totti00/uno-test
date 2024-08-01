import { addPlayer, getPlayer, removePlayer, isTherePlayer } from '../src/utils/playersSockets';

describe('playersSockets', () => {
    const socketId = 'socket1';
    const playerId = 'player1';
    const serverId = 'server1';

    beforeEach(() => {
        // Pulire lo stato prima di ogni test
        removePlayer(socketId);
    });

    test('addPlayer should add a player', () => {
        addPlayer(socketId, playerId, serverId);
        const player = getPlayer(socketId);
        expect(player).toEqual({ playerId, serverId });
    });

    test('removePlayer should remove a player', () => {
        addPlayer(socketId, playerId, serverId);
        removePlayer(socketId);
        expect(() => getPlayer(socketId)).toThrow('Player is not in any server');
    });

    test('getPlayer should return the correct player', () => {
        addPlayer(socketId, playerId, serverId);
        const player = getPlayer(socketId);
        expect(player).toEqual({ playerId, serverId });
    });

    test('getPlayer should throw an error if player does not exist', () => {
        expect(() => getPlayer(socketId)).toThrow('Player is not in any server');
    });

    test('isTherePlayer should return true if player exists', () => {
        addPlayer(socketId, playerId, serverId);
        expect(isTherePlayer(socketId)).toBe(true);
    });

    test('isTherePlayer should return false if player does not exist', () => {
        expect(isTherePlayer(socketId)).toBe(false);
    });
});