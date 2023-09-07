import {message} from "antd";
import {Socket} from "socket.io-client";
import {NavigateFunction} from "react-router-dom";
import {SocketGameStartResponse, SocketRoomResponse} from "../types/socketResponse";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {Dispatch} from "react";
import {AnyAction} from "@reduxjs/toolkit";
import {init, updateCards} from "../reducers.ts";

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
        response?.success && navigate("/home"))
}

export const leaveRoom = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined,
    roomName: string,
    inGame: boolean,
    navigate: NavigateFunction,
) => {
    socket?.emit("leave_room", roomName, inGame, (response: SocketRoomResponse) =>
        response?.success && navigate("/home"))

}

export const startGame = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined,
    roomName: string,
    navigate: NavigateFunction,
) => {
    socket?.emit("request_start_game", roomName, (response: SocketGameStartResponse) => {
        if (response?.success) {
        message.success("Game started!")
        navigate("/game", {
            state: {
                isFirst: response.isFirst,
                roomName: roomName
            }
        })
      } else
        message.error("This room has not reach the minimum people to start a game!")
    })
}

export const fetchCards = (dispatch: Dispatch<AnyAction>, players: number) => {
    fetch('http://localhost:3000/cards/', { mode: 'cors' })
        .then((res) => res.json())
        .then((data) => {
            dispatch(updateCards(data));
            console.info("data", data);
            dispatch(init({cards: data, players}));
        })
        .catch((err) => {
            console.log(err.message);
        });
}
