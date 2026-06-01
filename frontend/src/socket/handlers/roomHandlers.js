import { getSocket } from "../index"
import {ROOM_EVENTS} from "../events"
import useNotificationStore from "../../store/notificationStore"

const registerRoomHandler = () => {
    const socket = getSocket()
    const onAdminJoined = (data) => {
        useNotificationStore.getState().setNotification(data.message, "message")
    }

    const onUserJoined = (data) => {
        useNotificationStore.getState().setNotification(data.message, "success")
    }

    socket.on(ROOM_EVENTS.ADMIN_JOINED, onAdminJoined)
    socket.on(ROOM_EVENTS.JOIN, onUserJoined)

    return () => {
        socket.off(ROOM_EVENTS.ADMIN_JOINED, onAdminJoined)
        socket.off(ROOM_EVENTS.JOIN, onUserJoined)
    }
}

export default registerRoomHandler