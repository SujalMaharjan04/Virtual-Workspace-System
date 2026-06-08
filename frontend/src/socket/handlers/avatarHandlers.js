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
    socket.on(AVATAR_EVENTS.SELF, (avatar) => {
        useAvatarStore.getState().setLocalPlayer({
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
    socket.on(AVATAR_EVENTS.DISPLAY, ({userId, userName, x, y, direction, avatarId}) => {
        // useAvatarStore.getState().updatePlayerPosition({
        //     user: avatar.user.userId,            
        //     x: avatar.x_axis,
        //     y: avatar.y_axis,
        //     direction: avatar.direction,
        //     avatar: avatar.avatarId
        // })
        const state = useAvatarStore.getState()

        if (!state.otherPlayer[userId]) {
            state.addPlayer({userId, userName, x, y, direction, avatarId})
        } else {
            state.updatePlayerPosition({userId,  x, y, direction, avatarId})
        }
    })
 
    socket.on(AVATAR_EVENTS.POSITION, (data) => {
            data.forEach(d => (
                useAvatarStore.getState().addPlayer({
                    userId: d.created_by, 
                    userName: d.user.name, 
                    x: d.x_axis, 
                    y: d.y_axis, 
                    direction: d.direction, 
                    avatarId: d.avatar_id  
                })
            ))
    })

    return () => {
        socket.off(AVATAR_EVENTS.SELF)
        socket.off(AVATAR_EVENTS.DISPLAY)
        socket.off(AVATAR_EVENTS.POSITION)
        useAvatarStore.getState().registerEmitJoined(null)
        useAvatarStore.getState().registerEmitMoved(null)    
    }


}

export default registerAvatarHandler

