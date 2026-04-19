import { Navigate } from "react-router-dom"
import useRoomStore from "../store/roomStore"

const ProtectedRoom = ({children}) => {
    const roomToken = useRoomStore(state => state.token)

    if (!roomToken) {
        return <Navigate to = "/" />
    }
    return children
}

export default ProtectedRoom