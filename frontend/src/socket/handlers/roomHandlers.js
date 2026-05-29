import socket from "../index"
import {ROOM_EVENTS} from "../events"

const registerRoomHandler = () => {
    socket.on(ROOM_EVENTS.ADMIN_JOINED, (data) => {
        console.log("Admin joined:", data)
    })
}

export default registerRoomHandler