import { getSocket } from "../index"
import {MESSAGE_EVENTS, ROOM_EVENTS} from "../events"
import useNotificationStore from "../../store/notificationStore"
import { getActiveScene } from "../../game/scene/SceneRegistry"
import useAuthStore from "../../store/authStore"
import useAvatarStore from "../../store/avatarStore"
import useRoomStore from "../../store/roomStore"
import { decryptAESKey, encryptAESKey, generateAESkey } from "../../utils/AESkey"
import useTaskStore from "../../store/taskStore"

const registerRoomHandler = () => {
    const socket = getSocket()


    //When the admin joins the room
    const onAdminJoined = async(data) => {
        const userId = useAuthStore.getState().user.id
        const room = useRoomStore.getState().room
        const isAdmin = userId === room.created_by


        useNotificationStore.getState().setNotification(data.message, "success")

        if (isAdmin) {
            const aesKey = await generateAESkey()
            useRoomStore.getState().setAESKey(aesKey)
        }
    }

    //When other user joins the room
    const onUserJoined = (data) => {
        useRoomStore.getState().addRoomMembers({id: data.userId, name: data.userName, role: data.role, is_active: data.is_active})
        useNotificationStore.getState().setNotification(data.message, "success")
    }

    //When the user leaves the room, the event is received from backend
    const onUserLeft = (data) => {
        const scene = getActiveScene()
        if (!scene) return 
        scene.removeOtherPlayer(data.userId)
        useAvatarStore.getState().removePlayer(data.userId)
        useRoomStore.getState().removeRoomMembers({id: data.userId})
        useNotificationStore.getState().setNotification(`${data.userName} has left the room`, "success")
    }

    //When the user joins the room, they get the members list
    const onMembers = (members) => {
        useRoomStore.getState().setRoomMembers(members)
        const room = useRoomStore.getState().room
        const isAdmin = room?.created_by === useAuthStore.getState().user.id

        if (!isAdmin) {
            socket.emit(ROOM_EVENTS.SHARE_PUBLIC_KEY)
        }
    }

    //When the user joins the room, they get the tasks
    const onTasks = (tasks) => {
        useTaskStore.getState().setTask(tasks)
    }

    const adminEncryptsKey = async({userPublicKey, requesterSocketId}) => {
        const aesKey = useRoomStore.getState().aesKey

        const publicKeyBuffer = Uint8Array.from(atob(userPublicKey), c => c.charCodeAt(0)).buffer
        const cryptoPublicKey = await window.crypto.subtle.importKey(
            "spki",
            publicKeyBuffer,
            {name: "RSA-OAEP", hash: "SHA-256"},
            false,
            ["encrypt"]
        )
        const encryptedKey = await encryptAESKey(aesKey, cryptoPublicKey)
        socket.emit(ROOM_EVENTS.SHARE_ENCRYPT_KEY, {encryptedKey, requesterSocketId})
    }


    //When the user leaves, this event is emitted
    useRoomStore.getState().registerEmitLeave(({userId, roomId}) => {
        socket.emit(ROOM_EVENTS.LEAVE, {
            userId, roomId
        })
        useAvatarStore.getState().clearPlayer()
        useAvatarStore.getState().removeUser()
    }) 

    socket.on(ROOM_EVENTS.RECEIVE_AES_KEY, async(encryptedKey) => {
        
        let  privateKey = localStorage.getItem("privateKey")
        
        privateKey = Uint8Array.from(atob(privateKey), c => c.charCodeAt(0)).buffer
        
        privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            privateKey,
            { name: "RSA-OAEP", hash: "SHA-256"},
            false,
            ["decrypt"]
        )
        
        const key =  await decryptAESKey(encryptedKey, privateKey)

        
        useRoomStore.getState().setAESKey(key)
        const {room} = useRoomStore.getState()
        const roomId = room.room_id
        socket.emit(MESSAGE_EVENTS.LOAD_HISTORY, {roomId})
    })

    socket.on(ROOM_EVENTS.ADMIN_JOINED, onAdminJoined)
    socket.on(ROOM_EVENTS.JOIN, onUserJoined)
    socket.on(ROOM_EVENTS.TASKS, onTasks)
    socket.once(ROOM_EVENTS.MEMBERS, onMembers)
    
    socket.on(ROOM_EVENTS.ADMIN_ENCRYPT_KEY, adminEncryptsKey)
    socket.on(ROOM_EVENTS.USER_LEFT, onUserLeft)

    return () => {
        socket.off(ROOM_EVENTS.ADMIN_JOINED, onAdminJoined)
        socket.off(ROOM_EVENTS.JOIN, onUserJoined)
        socket.off(ROOM_EVENTS.USER_LEFT, onUserLeft)
        socket.off(ROOM_EVENTS.ADMIN_ENCRYPT_KEY, adminEncryptsKey)
        socket.off(ROOM_EVENTS.RECEIVE_AES_KEY)
        socket.off(ROOM_EVENTS.MEMBERS, onMembers)
        socket.off(ROOM_EVENTS.TASKS, onTasks)
    }
}

export default registerRoomHandler