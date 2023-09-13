const GameServer = require("./GameServer.cjs");

const servers = {};

const setServer = (server) => {
  servers[server.serverId] = server;
};

const getServer = (id) => {
  if (!servers[id]) throw new Error("Server Don't Exist");
  return servers[id];
};

const getServerPlayers = (serverId) => {
  if (!servers[serverId]) throw new Error("Server Don't Exist");
  return servers[serverId].players.map((p) => ({ ...p, cards: [] }));
};

const getServerByPlayerId = (playerId) => {
    const server = Object.values(servers).filter((server) => {
        for(const player of server.players) {
            if(player.name === playerId) return server;
        }}).map((server) => ({
        id: server.serverId,
        name: server.serverName,
    }))
    if (!server) throw new Error("Server Don't Exist");
    return server[0].name;
}

const getAllServers = () =>
  Object.values(servers)
    .filter((server) => !server.gameRunning)
    .map((server) => ({
      id: server.serverId,
      name: server.serverName,
      cntPlayers: `${server.players.length}/${server.numberOfPlayers}`,
    }));

const deleteServer = (serverId) => {
  delete servers[serverId];
};

export {setServer, deleteServer, getServer, getAllServers, getServerPlayers, getServerByPlayerId};

