import { IPlayer, IGameServer } from "../src/utils/interfaces";
import { setServer, deleteServer, getServer, getServerPlayers, getServerByPlayerId, isThereServer, getAllServers } from "../src/utils/servers";
import GameServer from "../src/utils/gameServer";
import express from 'express';
import http from 'http';
import { ServerSocket } from '../socket';
import cors from 'cors';
import session from 'express-session';
import mongoose from 'mongoose';
import { cardsRouter } from '../src/routes/cardsRouter';
import dotenv from 'dotenv';
dotenv.config();

// Configurazione del server
const app = express();
const PORT = 3000;
const httpServer = http.createServer(app);
new ServerSocket(httpServer);

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/unoProgetto";
app.use(cors());
app.use(session({
  secret: 'keyboard',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false
}));
app.use(express.json());
app.use(cardsRouter);
app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

describe('Server Manager', () => {
    let server: http.Server;
    const mockServerName = 'Test Server';
    const mockPlayerId = 'player1';
    
    let mockServer: IGameServer;

    beforeEach((done) => {
        mockServer = new GameServer(mockServerName);
        mongoose.connect(mongoUri);
        mongoose.connection.once('open', () => {
            server = httpServer.listen(PORT, () => {
                //console.log(`Listening on http://localhost:${PORT}`);
                done();
            });
        });
    });

    afterEach((done) => {
        jest.clearAllMocks();
        deleteServer(mockServer.serverId);
        mongoose.disconnect();
        server.close(done);
    });

    it('should set and get server correctly', async () => {
        await mockServer.init();
        setServer(mockServer);
        const server = getServer(mockServer.serverId);
        expect(server).toEqual(mockServer);
    });

    it('should throw error if server does not exist', () => {
        expect(() => getServer('non-existent-id')).toThrow("Server doesn't exist");
    });

    it('should check if server exists', async () => {
        await mockServer.init();
        setServer(mockServer);
        expect(isThereServer(mockServer.serverId)).toBe(true);
        expect(isThereServer('non-existent-id')).toBe(false);
    });

    it('should get server players correctly', async () => {
        await mockServer.init();
        setServer(mockServer);
        const players = getServerPlayers(mockServer.serverId);
        expect(players).toHaveLength(0); // Assumiamo che il server appena creato non abbia giocatori
    });

    it('should throw error if getting players from non-existent server', () => {
        expect(() => getServerPlayers('non-existent-id')).toThrow("Server doesn't exist");
    });

    it('should get server by player id correctly', async () => {
        await mockServer.init();
        setServer(mockServer);
        // Aggiungi un giocatore al server
        const playerId = mockServer.joinPlayer({
            id: mockPlayerId,
            name: 'Player 1',
            seed: 'seed1',
            socketID: 'socket1',
            cards: [],
            disconnected: false,
            timeOutCount: 0,
            isMaster: true,
        });
        const serverName = getServerByPlayerId(playerId);
        expect(serverName).toBe(mockServerName);
    });

    it('should throw error if player id does not exist', () => {
        expect(() => getServerByPlayerId('non-existent-player-id')).toThrow("Server doesn't exist");
    });

    it('should get all servers correctly', () => {
        setServer(mockServer);
        const allServers = getAllServers();
        expect(allServers).toHaveLength(1);
        expect(allServers[0].id).toBe(mockServer.serverId);
        expect(allServers[0].name).toBe(mockServerName);
        expect(allServers[0].cntPlayers).toBe('0/4');
    });

    it('should delete server correctly', () => {
        setServer(mockServer);
        deleteServer(mockServer.serverId);
        expect(() => getServer(mockServer.serverId)).toThrow("Server doesn't exist");
    });
});