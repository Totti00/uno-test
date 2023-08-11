const disconnect = (socket) => {
    socket.on("disconnect", () => {
        console.log("User disconnected");
        socket.disconnect();

    });
}


module.exports = {
    disconnect

}
