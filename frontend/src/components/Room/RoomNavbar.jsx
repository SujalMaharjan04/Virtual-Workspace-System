import { useState } from "react"
import useRoomStore from "../../store/roomStore"
import MemberList from "./MemberList"
import Togglable from "../Shared/Togglable"

const RoomNavbar = () => {
    const room = useRoomStore(state => state.room)
    const [activeModal, setActiveModal] = useState(null)
    return (
        <div className = "bg-[#1A1D2E] flex justify-between items-center">
            <div className = "m-8 w-[50%]">
                <h1 className = "font-bold text-3xl">{room.room_name}</h1>
            </div>
            
            <div className = "flex justify-end items-center gap-6 w-full">
                <div className = "w-[15%]">
                    <Togglable buttonClass = "submitBtn" buttonLabel = "Inbox" isOpen = {activeModal === "Inbox"} onOpen = {() => setActiveModal("Inbox")} onClose = {() => setActiveModal(null)}>
                        <MemberList />
                    </Togglable>
                </div>

                <div className = "w-[15%]">
                    <Togglable buttonClass = "submitBtn" buttonLabel = "Member" isOpen = {activeModal === "Member"} onOpen = {() => setActiveModal("Member")} onClose = {() => setActiveModal(null)}>
                        <MemberList />
                    </Togglable>
                </div>

                <div className = "w-[15%]">
                    <Togglable buttonClass = "submitBtn" buttonLabel = "Tasks" isOpen = {activeModal === "Tasks"} onOpen = {() => setActiveModal("Tasks")} onClose = {() => setActiveModal(null)}>
                        <MemberList />
                    </Togglable>
                </div>
            </div>
        </div>
    )
}

export default RoomNavbar