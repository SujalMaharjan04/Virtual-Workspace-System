import { useEffect } from "react";
import socket from "../socket";
import registerRoomHandler from "../socket/handlers/roomHandlers";


const useSocket = () => {
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("room-info")).state.token
        if (!token) return

        socket.auth = {token}

        const handleConnect = () => {
            registerRoomHandler()
        }

        const handleConnectError = (error) => {
            console.log("Socket connection error:", error)
        }

        socket.on("connect", handleConnect)
        socket.on("connect_error", handleConnectError)

        socket.connect()

        return () => {
            socket.off("connect", handleConnect)
            socket.off("connect_error", handleConnectError)
            socket.disconnect()
        }
    }, [])

    return socket
}

export default useSocket