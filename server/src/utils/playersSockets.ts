interface SocketToServerPlayer {
    [socketId: string]: { playerId: string; serverId: string };
}

const socketToServerPlayer: SocketToServerPlayer = {};

const addPlayer = (socketId: string, playerId: string, serverId: string): void => {
    socketToServerPlayer[socketId] = { playerId, serverId };
};

const removePlayer = (socketId: string): void => {
    delete socketToServerPlayer[socketId];
};

const getPlayer = (socketId: string): { playerId: string; serverId: string } => {
    if (!socketToServerPlayer[socketId])
        throw new Error("Player is not in any server");
    return socketToServerPlayer[socketId];
};

const isTherePlayer = (socketId: string): boolean => {
    return !!socketToServerPlayer[socketId];
}

export { addPlayer, getPlayer, removePlayer, isTherePlayer };
