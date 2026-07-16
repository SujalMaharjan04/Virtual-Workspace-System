import useTaskStore from "../../store/taskStore"
import { useRef, useState } from "react"
import TaskForm from "./TaskForm"
import Togglable from "../Shared/Togglable"
import MemberList from "../Room/MemberList"
import TaskCard from "./TaskCard"
import useRoomStore from "../../store/roomStore"
import useAuthStore from "../../store/authStore"


const TaskList = () => {
    const tasks = useTaskStore(state => state.tasks)
    const members = useRoomStore(state => state.roomMembers)
    const [activeModal, setActiveModal] = useState(null)
    const addToggleRef = useRef()
    const assignToggleRef = useRef()
    const currentUserId = useAuthStore(state => state.user.id)
    const currentUser = members.find(member => member.id === currentUserId)
    const isViewerAdmin = currentUser?.role === "admin"
    return (
        <div className = "flex flex-col justify-center items-center h-full ">
            <div>
                <h1 className = "text-5xl font-bold mb-6">Task</h1>
            </div>

            <div className = "flex-1 overflow-y-auto w-full ">
                {tasks.length === 0 
                    ? <div className = "flex h-full justify-center items-center text-4xl font-bold">No Task Available Yet</div> 
                    : <div className = "flex flex-col justify-center items-center gap-2 w-full">{tasks.map(task => (<TaskCard task = {task} />))}</div>
                }
            </div>

            <div className = "flex justify-around items-center gap-2 w-full py-4">
                <Togglable ref = {addToggleRef} wrapperClass = "flex justify-center " buttonClass = "submitBtn w-full " buttonLabel = "Add Task" isOpen = {activeModal === 'add'} onOpen = {() => setActiveModal("add")} onClose = {() => setActiveModal(null)}>
                    <TaskForm  submitType = "Add Task" onSuccess = {() => setActiveModal(null)} />
                </Togglable>
                {isViewerAdmin && <Togglable ref = {assignToggleRef} wrapperClass = "flex justify-center " buttonClass = "submitBtn w-full" buttonLabel = "Assign Task" isOpen = {activeModal === 'assign'} onOpen = {() => setActiveModal("assign")} onClose = {() => setActiveModal(null)}>
                    <MemberList button = "assign"/>
                </Togglable>}
            </div>
        </div>
    )
}

export default TaskList