import {Socket, Server} from "socket.io";
import {user} from "../types/user";
import {v4} from "uuid";

var host = new Map()
var roomState = new Map()

export const sendMessage = (messageType: string, users: string[], io: Server, payload?: Object) => {
    console.info(`Emitting event: ${messageType} to`, users);
    users.forEach((id) => (payload ? io.to(id)?.emit(messageType, payload) : io.to(id)?.emit(messageType)));
};

export const getRooms = (availableRooms: Map<string, Set<string>>) => {
    const filteredRooms = new Map<string, Array<string>>();

    for (const [roomId, users] of availableRooms.entries()) {
        if (roomId.startsWith("room")) {
            filteredRooms.set(roomId, [...users]);
        }
    }
    return filteredRooms;
};

export const getUsersInRoom = (io: Server, roomName: string) => io.sockets.adapter.rooms.get(roomName)

export const getCurrentRoom = (roomName: string, users: Set<string> | undefined) => {
    if (!users)
        return {
            data: {
                roomName,
                users: JSON.stringify([])
            }
        }
    else
        return {
            data: {
                roomName,
                users: JSON.stringify(users && [...users])
            }
        }
};

export const startListeners = (io: Server, socket: Socket, socketUsers: user) => {
    console.info('Message received from socketId: ' + socket.id);

    socket.on('handshake', (callback: (uid: string, users: string[]) => void) => {
        console.info('Handshake received from: ' + socket.id);
        const uid = v4();
        socketUsers[uid] = socket.id;
        const users = Object.values(socketUsers);
        console.info('Sending callback for handshake ...');
        callback(uid, users);

        sendMessage('user_connected', users.filter((id) => id !== socket.id), io, users);
    });

    socket.on('create_room', (value, callback) => {
        console.info(`User ${socket.id} want to create a room ${value}`);
        if (io.sockets.adapter.rooms.has("room_"+value)) return
        socket.join("room_"+value)
        host.set("room_"+value, socket.id)
        roomState.set("room_"+value, false)
        const response = {success: true, ...getCurrentRoom("room_"+value, getUsersInRoom(io, "room_"+value))}
        const response2 = {success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)])}

        io.emit("update_rooms", response2);
        callback(response);
    })

    socket.on('get_rooms', (callback) => {
        const response = { success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)]) };
        io.emit("update_rooms", response);
        callback(response);
    });

    socket.on('join_room', (value, callback) => {
        if (!io.sockets.adapter.rooms.has(value)) return
        console.info(`User ${socket.id} want to join room ${value}`);
        socket.join(value);
        const response = { success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)]) };
        io.emit("update_rooms", response);
        callback(response);
    });

    socket.on('leave_room', (roomName, inGame, callback) => {
        console.info(`User ${socket.id} want to leave room ${roomName}`);
        socket.leave(roomName);
        let roomPlayers = io.sockets.adapter.rooms.get(roomName)?.size
        if (roomPlayers && roomPlayers < 3 && inGame) {
            io.sockets.adapter.rooms.get(roomName)?.forEach((socketId) => {
                io.sockets.sockets.get(socketId)?.leave(roomName)
            });
        }
        const response = { success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)]) };
        callback(response);
        io.emit("update_rooms", response);
    });
}