export type SocketRoomResponse = {
    success: boolean,
    data: {
        roomName: string
        users: Array<string>
    }
}