const { nanoid } = require('nanoid');

const servers = {};

const createServer = (serverName) => {
    const server = new GameServer(serverName);
    //const serverID = nanoid();
    servers[serverName] = server;
    server.init();
}

const joinServer = (serverName, player) => {
    const server = servers[serverName];
  
    if (!server) return false;
    if (server.players.length >= 4) return false;

    server.join(player);
}

const getServer = (id) => servers[id];

module.exports = {
    createServer,
    joinServer,
    getServer
};