import { useState } from "react"
import taskService from '../../services/task'

const TaskForm = ({submitType, onSuccess}) => {
    const [task, setTask] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("MEDIUM")
    const [deadline, setDeadline] = useState("")

    const handleSubmit = async(e) =>  {
        e.preventDefault()
        if (submitType === "Add Task") {
            const newTask = {
                title: task,
                description,
                priority,
                deadline,
            }
            await taskService.addTask(newTask)
            setTask("")
            setDescription("")
            setPriority("")
            setDeadline("")
            onSuccess?.()
        }
    }
    return (
        <div className = "flex flex-col items-center justify-center h-full">
            <div>
                <form className = "form" onSubmit = {handleSubmit}>
                    <div className = "inputDivStyle">
                        <label htmlFor= "Task">Task</label>
                        <input type = "text" name = "task" onChange = {(e) => setTask(e.target.value)} className = "inputStyle" placeholder = "Enter Task" value = {task} />
                    </div>
                    <div className = "inputDivStyle">
                        <label htmlFor="description">Description</label>
                        <textarea type = "text" name = "description" onChange = {(e) => setDescription(e.target.value)} className = "w-full min-h-32 px-4 py-3 rounded-xl border border-gray-300 bg-[#D9D9D9] text-black resize-y focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent" placeholder = "Enter Description" value = {description}/>
                    </div>

                    <div className = "inputDivStyle">
                        <div>
                            <label htmlFor = "Priority">Priority</label><br />
                            <select value = {priority} onChange = {(e) => setPriority(e.target.value)} className = "bg-[#D9D9D9] text-black border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]">
                                <option value = "LOW">Low</option>
                                <option value = "MEDIUM">Medium</option>
                                <option value = "HIGH">High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor = "Deadline">Deadline</label><br />
                            <input type = "date" value = {deadline} onChange = {(e) => setDeadline(e.target.value)} min = {new Date().toISOString().split("T")[0]} className = "bg-[#D9D9D9] text-black border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]" />
                        </div>
                    </div>

                    <div className = "w-full flex justify-center items-center">
                        <button type = "submit" className = "submitBtn">{submitType}</button>

                    </div>
                </form>
            </div>
            
        </div>
    )
}

export default TaskForm