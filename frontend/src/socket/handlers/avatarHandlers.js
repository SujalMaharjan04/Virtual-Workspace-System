import { getSocket } from "../index";
import { AVATAR_EVENTS } from "../events";
import useAvatarStore from "../../store/avatarStore";

const registerAvatarHandler = () => {
    const socket = getSocket()

    socket.on(AVATAR_EVENTS.POSITION, (data) => {
            data.map(d => (
                useAvatarStore.getState().addPlayer({userId: d.created_by, userName: d.user.name, x: d.x_axis, y: d.y_axis, direction: d.direction, avatarId: d.avatar_id  })
            ))
    })


}

export default registerAvatarHandler

