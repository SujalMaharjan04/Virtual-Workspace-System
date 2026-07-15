
const TaskCard = ({task}) => {
    return (
        <div className = "bg-[#22263E] flex flex-col items-center justify-start">
            <div>
                <h1 className = "text-xl font-bold">{task.title}</h1>
            </div>

            <div>
                <p className = "text-md font-medium">{task.description}</p>
            </div>

            <div>
                Priority: <span className = "text-md font-medium">{task.priority}</span>
            </div>
            
            <div>
                Due: <span className = "text-md font-medium">{task.deadline}</span>
            </div>

            <div>
                Assigned by: <span className = "text-md font-medium">{task.created_by.name}</span>
            </div>

            <div>
                Assigned to: <span className = "text-md font-medium">{task.assigned_to.name}</span>
            </div>

            <div>
                Status: <span className = "text-md font-medium">{task.status}</span>
            </div>
            
        </div>
    )
}

export default TaskCard