import { getSocket } from "../index"
import {ROOM_EVENTS} from "../events"
import useNotificationStore from "../../store/notificationStore"
import { getActiveScene } from "../../game/scene/SceneRegistry"
import useAvatarStore from "../../store/avatarStore"
import useRoomStore from "../../store/roomStore"

const registerRoomHandler = () => {
    const socket = getSocket()

    //When the admin joins the room
    const onAdminJoined = (data) => {
        useNotificationStore.getState().setNotification(data.message, "message")
    }

    //When other user joins the room
    const onUserJoined = (data) => {
        useRoomStore.getState().setRoomMember(data.userId, data.userName)
        useNotificationStore.getState().setNotification(data.message, "success")
    }

    //When the user leaves the room, the event is received from backend
    const onUserLeft = (data) => {
        const scene = getActiveScene()
        if (!scene) return 
        scene.removeOtherPlayer(data.userId)
        useAvatarStore.getState().removePlayer(data.userId)
        useNotificationStore.getState().setNotification(`${data.userName} has left the room`, "success")
    }


    //When the user leaves, this event is emitted
    useRoomStore.getState().registerEmitLeave(({userId, roomId}) => {
        socket.emit(ROOM_EVENTS.LEAVE, {
            userId, roomId
        })
        useAvatarStore.getState().clearPlayer()
        useAvatarStore.getState().removeUser()
    }) 

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