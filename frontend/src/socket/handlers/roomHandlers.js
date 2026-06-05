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

    const onUserLeft = (data) => {
        useNotificationStore.getState().setNotification(data.message, "success")
    }

    socket.on(ROOM_EVENTS.ADMIN_JOINED, onAdminJoined)
    socket.on(ROOM_EVENTS.JOIN, onUserJoined)
    socket.on(ROOM_EVENTS.USER_LEFT, onUserLeft)

    return () => {
        socket.off(ROOM_EVENTS.ADMIN_JOINED, onAdminJoined)
        socket.off(ROOM_EVENTS.JOIN, onUserJoined)
        socket.off(ROOM_EVENTS.USER_LEFT, onUserLeft)
    }
}

export default registerRoomHandler