import { useEffect } from "react";
import { createSocket } from "../socket";
import registerRoomHandler from "../socket/handlers/roomHandlers";

let socket

const useSocket = () => {
    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem("room-info")).state.token
        if (!token) return

        socket = createSocket(token)

        let cleanUpRoomHandler = null

        const handleConnect = () => {
            if (cleanUpRoomHandler) cleanUpRoomHandler()
            cleanUpRoomHandler = registerRoomHandler()
        }

        const handleConnectError = (error) => {
            console.log("Socket connection error:", error)
        }

        socket.on("connect", handleConnect)
        socket.on("connect_error", handleConnectError)

        if (!socket.connected) {
            socket.connect()
        }

        return () => {
            socket.off("connect", handleConnect)
            socket.off("connect_error", handleConnectError)
            if (cleanUpRoomHandler) cleanUpRoomHandler()
            // socket.disconnect()
        }
    }, [])

    return socket
}

export default useSocket