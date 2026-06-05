import { getSocket } from "../index";
import { AVATAR_EVENTS } from "../events";
import useAvatarStore from "../../store/avatarStore";

const registerAvatarHandler = () => {
    const socket = getSocket()

    //socket emit to server when joining the room and selecting the avatar
    useAvatarStore.getState().registerEmitJoined(({userId, avatarId, roomId}) => {
        socket.emit(AVATAR_EVENTS.JOIN, {
            userId, avatarId, roomId
        })
    })

    //server responds with the localplayer spawn if already present else at spawnpoint
    socket.on(AVATAR_EVENTS.SELF, async(avatar) => {
        await useAvatarStore.getState().setLocalPlayer({
            x: avatar.x_axis, 
            y: avatar.y_axis,
            direction: avatar.direction,
            avatarId: avatar.avatar_id,
            userId: avatar.created_by,
            roomId: avatar.room_id,
            userName: avatar.user.name
        })
    })

    //socket emit to server when the avatar moves 
    useAvatarStore.getState().registerEmitMoved(({userId, roomId, avatarId, x, y, direction}) => {
        // console.log(`userId: ${userId}, roomId: ${roomId}, avatarId: ${avatarId}, x: ${x}, y: ${y}, direction: ${direction}`)
        socket.emit(AVATAR_EVENTS.MOVE, {
            userId, 
            roomId, 
            avatarId, 
            x, y,
            direction
        })
    })

    //server responds with new position of the avatar after moved
    socket.on(AVATAR_EVENTS.DISPLAY, (avatar) => {
        useAvatarStore.getState().updateLocalPlayer({
            x: avatar.x_axis,
            y: avatar.y_axis,
            direction: avatar.direction
        })
    })
 
    socket.on(AVATAR_EVENTS.POSITION, (data) => {
            data.map(d => (
                useAvatarStore.getState().addPlayer({userId: d.created_by, userName: d.user.name, x: d.x_axis, y: d.y_axis, direction: d.direction, avatarId: d.avatar_id  })
            ))
    })


}

export default registerAvatarHandler

