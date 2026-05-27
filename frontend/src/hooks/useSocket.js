import { useEffect } from "react";
import socket from "../socket";


const useSocket = () => {
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("room-info")).state.token

        if (!token) return

        socket.auth = {token}

        socket.connect()

        return () => {
            socket.off()
            socket.disconnect()
        }
    }, [])

    return socket
}

export default useSocket