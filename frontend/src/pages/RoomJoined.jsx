import { useState, useEffect } from "react"
import GameCanvas from "../components/Game/GameCanvas"
import RoomFooter from "../components/Room/RoomFooter"
import RoomNavbar from "../components/Room/RoomNavbar"
import AvatarSelection from "../components/Avatar/AvatarSelection"
import useSocket from "../hooks/useSocket"

const RoomJoined = () => {
    useSocket()
    const [avatarSelect, setAvatarSelect] = useState(false)

    useEffect(() => {
        const savedAvatar = localStorage.getItem("avatarId")
        if (savedAvatar) setAvatarSelect(true)
    }, [])


    return (
        <div className = "flex flex-col h-screen overflow-hidden">
            <RoomNavbar />
            <main className = "flex flex-1 w-full overflow-hidden">
                {avatarSelect ? <GameCanvas /> : <AvatarSelection onSelect = {() => setAvatarSelect(true)} />}
            </main>
            <RoomFooter />
        </div>
    )
}


export default RoomJoined