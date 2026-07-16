import { useRef, useState } from "react"
import useRoomStore from "../../store/roomStore"
import Togglable from "../Shared/Togglable"
import TaskForm from "../Tasks/TaskForm"
import useAuthStore from "../../store/authStore"

const MemberList = (props) => {
    const roomMembers = useRoomStore(state => state.roomMembers)
    const [activeModal, setActiveModal] = useState(null)
    const currentUserId = useAuthStore(state => state.user.id)
    const currentUser = roomMembers.find(member => member.id === currentUserId)
    const isViewerAdmin = currentUser?.role === "admin"
    const assignToggleRef = useRef()
    return (
        <div className = "flex flex-col h-full">
            <div className = "flex flex-col items-center gap-4 flex-1 overflow-y-auto py-6 w-full">
                {roomMembers.map(member => {
                    const canKick = isViewerAdmin && member.id !== currentUserId
                    const canAssign = isViewerAdmin && member.id !== currentUserId
                    return(
                    <div key = {member.id} className = "grid grid-cols-[1fr_auto] items-center gap-4 w-[50%]">
                        <span className = "flex items-center gap-2"><p className = {`${member.is_active ? "bg-green-500" : "bg-red-500"} rounded-full w-3 h-3`}></p>{member.name}</span>
                        {props.button === "Kick"
                            ?   <>
                                    {canKick && <button className = "px-4 h-12 rounded-2xl hover:cursor-pointer hover:bg-red-500 bg-red-700">{props.button}</button>}
                                    
                                </> 
                            : <>
                                {canAssign && <Togglable ref = {assignToggleRef} wrapperClass = "flex justify-center " buttonClass = "submitBtn w-full" buttonLabel = "Assign   Task" isOpen = {activeModal === member.id} onOpen = {() => setActiveModal(member.id)} onClose = {() => setActiveModal(null)}>
                                    <TaskForm  submitType = "Assign Task" assignedTo = {member.id} />
                                </Togglable>}
                                </>
                        }
                       
                        
                    </div>
                )})}
            </div>

            <div className = "flex justify-between items-center gap-8 w-[50%] mx-auto py-6 mt-auto">
                <button className = "submitBtn">Send the Invite Link</button>
                <button className = "submitBtn">Get Room Id</button>
            </div>

        </div>
    )
}

export default MemberList