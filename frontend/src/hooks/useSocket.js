import { useEffect } from "react";
import socket from "../socket";
import RegisterRoomHandler from "../socket/handlers/roomHandlers";


const useSocket = () => {
    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem("room-info")).state.token
        if (!token) return

        socket.auth = {token}

        let cleanUpRoomHandler = null

        const handleConnect = () => {
            if (cleanUpRoomHandler) cleanUpRoomHandler()
            cleanUpRoomHandler = RegisterRoomHandler()
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
            if (cleanUpRoomHandler) cleanUpRoomHandler()
            socket.disconnect()
        }
    }, [])

    return socket
}

export default useSocket