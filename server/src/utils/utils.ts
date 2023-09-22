import {Socket, Server} from "socket.io";
import {user} from "../types/user";
import {v4} from "uuid";

var host = new Map()
var roomState = new Map()
var firstPlayer = new Map()

export const getUidFromSocketID = (users: user, id: string) =>
    Object.keys(users).find((uid) => users[uid] === id);

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

    // socket.on('create_room', (value, callback) => {
    //     console.info(`User ${socket.id} want to create a room ${value}`);
    //     if (io.sockets.adapter.rooms.has("room_"+value)) return
    //     socket.join("room_"+value)
    //     host.set("room_"+value, socket.id)
    //     roomState.set("room_"+value, false)
    //     const response = {success: true, ...getCurrentRoom("room_"+value, getUsersInRoom(io, "room_"+value))}
    //     const response2 = {success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)])}
    //
    //     io.emit("update_rooms", response2);
    //     callback(response);
    // })
    //
    // socket.on('get_rooms', (callback) => {
    //     const response = { success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)]) };
    //     io.emit("update_rooms", response);
    //     callback(response);
    // });
    //
    // socket.on('join_room', (value, callback) => {
    //     if (!io.sockets.adapter.rooms.has(value)) return
    //     console.info(`User ${socket.id} want to join room ${value}`);
    //     socket.join(value);
    //     const response = { success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)]) };
    //     io.emit("update_rooms", response);
    //
    //     // const people = getUsersInRoom(io, "room_"+value)?.size;
    //     // if (people === 4) {
    //     //     io.to("room_" + value).emit("start_game");
    //     // }
    //
    //     callback(response);
    // });

    // socket.on('leave_room', (roomName, inGame, callback) => {
    //     console.info(`User ${socket.id} want to leave room ${roomName}`);
    //     socket.leave(roomName);
    //     let roomPlayers = io.sockets.adapter.rooms.get(roomName)?.size
    //     if (roomPlayers && roomPlayers < 3 && inGame) {
    //         io.sockets.adapter.rooms.get(roomName)?.forEach((socketId) => {
    //             io.sockets.sockets.get(socketId)?.leave(roomName)
    //         });
    //     }
    //     const response = { success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)]) };
    //     callback(response);
    //     io.emit("update_rooms", response);
    // });
    //
    // socket.on('delete_room', (value, callback) => {
    //     console.info(`User ${socket.id} want to delete a room ${value}`);
    //     //Fa uscire tutti i socket dalla stanza
    //     io.sockets.in(value).socketsLeave(value)
    //     // Crea una risposta con l'elenco delle stanze aggiornato
    //     const response = { success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)]) };
    //     // Invia un messaggio a tutti i client per aggiornare l'elenco delle stanze
    //     io.emit("update_rooms", response);
    //     // Richiama la funzione di callback con la risposta
    //     callback(response);
    // });

    // socket.on('disconnect', () => {
    //     console.info('Disconnect received from: ' + socket.id);
    //
    //     const uid = getUidFromSocketID(socketUsers, socket.id);
    //
    //     if (uid) {
    //         //Ciclo attraverso tutte le stanze
    //         io.sockets.adapter.rooms.forEach((room, roomName) => {
    //             //Se l'utente corrente è l'host della stanza, faccio uscire tutti dalla stanza
    //             if (roomName.includes("room")) {
    //                 if (host.get(roomName) === socket.id) {
    //                     room.forEach((socketId) => {
    //                         io.sockets.sockets.get(socketId)?.leave(roomName)
    //                     });
    //                 }
    //                 // Se la stanza ha uno stato, invia un messaggio "start_game" a tutti i giocatori tranne l'utente corrente (czar)
    //                 if (roomState.get(roomName)) {
    //                     let done = false
    //                     room.forEach(player => {
    //                         if (player != socket.id && !done) {
    //                             socket.to(player)?.emit("start_game", "czar", roomName)
    //                             done = true
    //                         }
    //                     })
    //                 }
    //             }
    //         });
    //         // Rimuovi l'utente disconnesso dall'elenco degli utenti
    //         delete socketUsers[uid];
    //         // Crea un array di utenti attivi
    //         const users = Object.values(socketUsers);
    //         // Ottieni l'elenco delle stanze attive
    //         const rooms = { success: true, data: Object.fromEntries([...getRooms(io.sockets.adapter.rooms)]) };
    //         // Invia un messaggio "user_disconnected" con dati aggiornati agli utenti rimasti
    //         sendMessage('user_disconnected', users, io, { uid: socket.id, rooms, users });
    //     }
    // });

    // socket.on('request_start_game', (roomName, callback) => {
    //     console.info(`User ${socket.id} want to start game in room ${roomName}`);
    //     roomState.set(roomName, true)
    //     if (!io.sockets.adapter.rooms.has(roomName)) return
    //     let roomPlayers = io.sockets.adapter.rooms.get(roomName)?.size
    //     if (roomPlayers && roomPlayers != 2) {
    //         callback ({success: false })
    //         return
    //     }
    //     let randomFirst = roomPlayers && Math.floor(Math.random() * roomPlayers)
    //     let index = 0;
    //     let isFirst = false;
    //
    //     io.sockets.adapter.rooms.get(roomName)?.forEach((socketId) => {
    //         if (index === randomFirst) {
    //             socket.to(socketId)?.emit("start_game", "first", roomName);
    //             firstPlayer.set(roomName, socketId)
    //             if (socketId === socket.id) isFirst = true    //SOCKET.ID è il giocatore corrente. SOCKETID è ogni giocatore
    //         } else {
    //             socket.to(socketId)?.emit("start_game", false, roomName);
    //         }
    //         index++;
    //     });
    //     const response = {success: true, isFirst};
    //     callback(response);
    // });

}