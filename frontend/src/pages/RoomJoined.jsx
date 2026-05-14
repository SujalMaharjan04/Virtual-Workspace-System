import { useEffect } from "react"
import GameCanvas from "../components/Game/GameCanvas"
import RoomFooter from "../components/Room/RoomFooter"
import RoomNavbar from "../components/Room/RoomNavbar"
import useRoomStore from "../store/roomStore"
import { jwtDecode } from "jwt-decode" 
import { useNavigate } from "react-router-dom"

const RoomJoined = () => {
    const navigate = useNavigate()
    const roomToken = useRoomStore(state => state.token)
    const leave = useRoomStore(state => state.leave)

    useEffect(() => {
        try {
            if (roomToken) {
                const {exp} = jwtDecode(roomToken)
                if (Date.now() >= exp * 1000) {
                    leave()
                    navigate("/")
                }
            } 
        }
        catch {
            leave()
        }
    })
    return (
        <div className = "flex flex-col h-screen overflow-hidden">
            <RoomNavbar />
            <main className = "flex flex-1 w-full overflow-hidden">
                <GameCanvas />
            </main>
            <RoomFooter />
        </div>
    )
}


export default RoomJoined