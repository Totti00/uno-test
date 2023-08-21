import {message} from "antd";
import {Socket} from "socket.io-client";
import {NavigateFunction} from "react-router-dom";
import {SocketRoomResponse} from "../types/socketResponse";
import {DefaultEventsMap} from "@socket.io/component-emitter";

export const createRoom = (socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined, roomName: string, navigate: NavigateFunction) => {
    if (roomName.length === 0) {
        message.error("Insert a Lobby name");
        return
    }
    socket?.emit("create_room", roomName, (response: SocketRoomResponse) => {
        if (response.success) {
            navigate("/waiting", {state: {roomName: response.data.roomName, type: "admin"}});
        }
        console.info(response);
    })
}

export const joinRoom = (socket : Socket<DefaultEventsMap, DefaultEventsMap> | undefined, roomName : string, navigate : NavigateFunction) => {
    socket?.emit("join_room", roomName, (response : any) => {
        if (response.success) {
            navigate("/waiting", {state: {roomName, type: "user"}});
        }
    })
}

export const deleteRoom = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined,
    roomName: string,
    navigate: NavigateFunction
) => {
    socket?.emit("delete_room", roomName, (response: SocketRoomResponse) =>
        response?.success && navigate("/"))
}

export const leaveRoom = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined,
    roomName: string,
    inGame: boolean,
    navigate: NavigateFunction,
) => {
    socket?.emit("leave_room", roomName, inGame, (response: SocketRoomResponse) =>
        response?.success && navigate("/"))

}