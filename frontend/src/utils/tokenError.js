import useAuthStore from "../store/authStore";
import useRoomStore from "../store/roomStore";
import { getSocket } from "../socket";

const socket = getSocket()

export const handleAuthError = () => {
    useAuthStore.getState().logout()
    useRoomStore.getState().leave()
    socket.off()
    socket.disconnect()
    window.location.href = "/auth"
}

export const handleRoomError = () => {
    useRoomStore.getState().leave()
    socket.emit("disconnect")
    window.location.href = "/"
}