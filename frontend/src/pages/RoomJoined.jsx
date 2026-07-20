import { useState, useEffect } from "react"
import GameCanvas from "../components/Game/GameCanvas"
import RoomFooter from "../components/Room/RoomFooter"
import RoomNavbar from "../components/Room/RoomNavbar"
import AvatarSelection from "../components/Avatar/AvatarSelection"
import useSocket from "../hooks/useSocket"
import useAuthStore from "../store/authStore"
import MeetingPrompt from "../components/Call/MeetingPrompt"
import CallInviteToast from "../components/Call/CallInviteToast"
import CallView from "../components/Call/CallView"

const RoomJoined = () => {
    useSocket()
    const [avatarSelect, setAvatarSelect] = useState(false)

    useEffect(() => {
        const savedAvatar = useAuthStore.getState().user.avatarId
        if (savedAvatar) setAvatarSelect(true)
    }, [])


    return (
        <div className = "flex flex-col h-screen overflow-hidden">
            <RoomNavbar />
            <main className = "flex flex-1 w-full overflow-hidden">
                {avatarSelect ? <GameCanvas /> : <AvatarSelection onSelect = {() => setAvatarSelect(true)} />}


                <MeetingPrompt />
                <CallInviteToast />
                <CallView />
                <CallInviteToast />
            </main>
            <RoomFooter />
        </div>
    )
}


export default RoomJoined