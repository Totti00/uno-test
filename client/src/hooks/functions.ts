import {message} from "antd";
import {Socket} from "socket.io-client";
import {NavigateFunction} from "react-router-dom";
import {SocketRoomResponse} from "../types/socketResponse";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export const createRoom = (socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined, roomName: string, navigate: NavigateFunction) => {
    if (roomName.length === 0) {
        message.error("Insert a Lobby name");
        return
    }
    socket?.emit("create_room", roomName, (response: SocketRoomResponse) => {

        if (response.success) {

            navigate("/waiting", {state: {roomName: response.data.roomName, type: "admin"}});
        }
    })
}