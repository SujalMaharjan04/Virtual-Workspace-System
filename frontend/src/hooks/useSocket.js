import { useEffect } from "react";
import { createSocket } from "../socket";
import registerRoomHandler from "../socket/handlers/roomHandlers";
import useRoomStore from "../store/roomStore";
import { handleAuthError, handleRoomError } from "../utils/tokenError";
import registerAvatarHandler from "../socket/handlers/avatarHandlers";
import registerMessageHandler from "../socket/handlers/messageHandlers";
import registerTaskHandler from "../socket/handlers/taskHandlers";

let socket

const useSocket = () => {
    useEffect(() => {
        const token = useRoomStore.getState().token
        if (!token) return

        socket = createSocket(token)

        let cleanUpRoomHandler = null

        const handleConnect = () => {
            registerRoomHandler()
            registerAvatarHandler()
            registerMessageHandler()
            registerTaskHandler()
        }

        const handleConnectError = (error) => {
            console.log("Socket connection error:", error)
            if (error.message === "ROOM_TOKEN_MISSING") {
                handleRoomError()
            } else if (error.message === "AUTH_TOKEN_MISSING") {
                handleAuthError()
            }
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