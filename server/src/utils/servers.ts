import { IPlayer, IGameServer } from "./interfaces";

const servers: { [key: string]: IGameServer } = {};

const setServer = (server: IGameServer): void => {
    servers[server.lobbyId] = server;
};

const getServer = (id: string): IGameServer => {
    if (!servers[id]) throw new Error("Server doesn't exist");
    return servers[id];
};

const isThereServer = (id: string): boolean => {
    return !!servers[id];
}

const getServerPlayers = (serverId: string): IPlayer[] => {
    if (!servers[serverId]) throw new Error("Server doesn't exist");
    return servers[serverId].players.map((p) => ({ ...p, cards: [] }));
};

const getServerByPlayerId = (playerId: string): string => {
    for (const serverId in servers) {
        const server = servers[serverId];
        const player = server.players.find((player) => player.id === playerId);
        if (player) return server.lobbyName;
    }
    throw new Error("Server doesn't exist");
};

const getAllServers = (): { id: string; name: string; cntPlayers: string }[] =>
    Object.values(servers)
        .filter((server) => !server.gameRunning)
        .map((server) => ({
            id: server.lobbyId,
            name: server.lobbyName,
            cntPlayers: `${server.players.length}/4`,
        }));

const deleteServer = (serverId: string): void => {
    delete servers[serverId];
};

export { setServer, deleteServer, getServer, getAllServers, getServerPlayers, getServerByPlayerId, isThereServer };
