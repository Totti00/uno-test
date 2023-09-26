const GameServer = require("./GameServer.cjs");
const {getServer, setServer, deleteServer} = require("./Servers.cjs");
const {addPlayer, removePlayer, getPlayer} = require("./PlayersSockets.cjs");
const {getCard} = require("./Cards.cjs");

function createServer({ serverName }) {
    if (serverName.trim().length < 2) throw new Error();
    const server = new GameServer(serverName);
    const serverId = server.serverId;
    setServer(server);
    server.init();
    return serverId;
}

function joinServer({
    serverId,
    io,
    player,
    socket,
    cb = () => {},
}) {
    const server = getServer(serverId);

    if (!server) throw new Error("Server Doesn't Exist");
    if (player.name.trim().length <= 1) throw new Error("Player Name too short");
    if (server.players.length >= server.numberOfPlayers)
        throw new Error("Server is Already full");

    let playerId;
    if (socket) {
        player.socketId = socket.id;
        socket.join(serverId);
        playerId = server.joinPlayer(player);
        addPlayer(socket.id, playerId, serverId);
    } else {
        playerId = server.joinPlayer(player);
    }

    cb(null, playerId);

    io.to(serverId).emit("players-changed", server.players);

    if (server.players.length === server.numberOfPlayers) {
        initGame(server, io);
    }
}

function initGame(server, io) {
    setTimeout(() => {
        server.start();
        const playersToSend = server.players.map((player) => ({
            ...player,
            cards: [], // just empty cards objects
        }));
        for (const player of server.players) {
            //console.info("cards in api.cjs: " + player.cards)
            if (player.socketId) {
                //console.info("lancio initgame al player: ", player)
                io.to(player.socketId).emit("init-game", {
                    players: playersToSend,
                    cards: player.cards,
                });
            }
        }
    }, 2000);
}

function startGame(serverId, io) {
    const server = getServer(serverId);
    if (!server.gameRunning) {
        server.gameRunning = true;
/*        if (
            server.players[server.curPlayer].disconnected ||
            server.players[server.curPlayer].isBot
        ) {
            setTimeout(() => {
                moveBot(server);
            }, 1500);
        }*/
        server.onFinish((playersOrdered) => {
            io.to(serverId).emit("finished-game", playersOrdered);
        });
    }
}

function move({ socket, cardId, draw }) {
    const { playerId, serverId } = getPlayer(socket.id);
    const server = getServer(serverId);
    const card = getCard(cardId);

    // Check if its my turn
    if (server.players[server.curPlayer].id !== playerId)
        throw new Error("Not Your Turn");

    // Make the move
    const { nxtPlayer, cardsToDraw } = server.move(draw, card);

    console.info("API.CJS cardsToDraw: ", cardsToDraw);

    //broadcast to all OTHER players
    socket.broadcast.to(serverId).emit("move", {
        nxtPlayer,
        card,
        draw: cardsToDraw?.length,
    });

    //send to my player
    socket.emit("move", {
        nxtPlayer,
        card,
        draw: cardsToDraw?.length,
        cardsToDraw,
    });
    /*if (
        server.players[server.curPlayer].disconnected ||
        server.players[server.curPlayer].isBot
    ) {
        setTimeout(() => {
            moveBot(server);
        }, 1500);
    }*/
}

function leaveServer(socket, io) {
    try {
        const player = getPlayer(socket.id);
        const { playerId, serverId } = player;
        const server = getServer(serverId);

        server.leavePlayer(playerId);
        let connectedPlayer = 0;
        for (const p of server.players) {
            if (!p.disconnected) connectedPlayer++;
        }
        if (connectedPlayer === 0) deleteServer(serverId);

        socket.leave(serverId);
        if (server.gameRunning) io.to(serverId).emit("player-left", playerId);
        else io.to(serverId).emit("players-changed", server.players);

        //if (server.players[server.curPlayer].id === playerId) moveBot(server);

        removePlayer(socket.id);
    } catch (error) {}
}

export {createServer, joinServer, startGame, leaveServer, move}