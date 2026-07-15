const prisma = require('../../src/db')

const getTask = async({roomId, userId, roomRole}) => {
    try {
        let tasks
        if (roomRole === "admin") {
            tasks = await prisma.task.findMany({
                where: {room_id: roomId},
                include: {
                    assignee: {select: {name: true, user_id: true}},
                    creator: {select: {name: true, user_id: true}}
                },
                orderBy: {
                    created_at: "asc"
                }
            })
        } else {
            tasks = await prisma.task.findMany({
                where: {
                    room_id: roomId,
                    OR: [
                        {assigned_to: userId},
                        {created_by: userId}
                    ]
                }, 
                include: {
                    assignee: {select: {name: true, user_id: true}},
                    creator: {select: {name: true, user_id: true}}
                },
                orderBy: {
                    created_at: "asc"
                }
            })
        }

        return tasks
    }
    catch (err) {
        throw err
    }
}

const addTask = async({roomId, userId, newTask}) => {
    try {
        const user = await prisma.room_members.findUnique({
            where: {
                room_id_user_id: {
                    room_id: roomId,
                    user_id: userId
                }
            },
            select: {
                role: true
            }
        })
        const userRole = user.role
        
        if (newTask.assignedTo && userRole !== "admin") {
            throw new Error("Only admins can assign tasks to others")
        }

        const assignedTo = newTask.assignedTo || userId

        const createdTask = await prisma.task.create({
            data: {
                room_id: roomId,
                assigned_to: assignedTo,
                created_by: userId,
                task: newTask.title,
                description: newTask.description,
                priority: newTask.priority,
                status: "PENDING",
                deadline: new Date(newTask.deadline)
            },
            include: {
                assignee: {
                    select: {
                        user_id: true,
                        name: true
                    }
                },
                creator: {
                    select: {
                        user_id: true,
                        name: true
                    }
                }
            }
        })

        

        if (!createdTask) {
            throw new Error("Task assignment failed")
        }

        const task = {
            ...createdTask,
            assigned_to: {
                id: createdTask.assignee.user_id,
                name: createdTask.assignee.name
            },
            created_by: {
                id: createdTask.creator.user_id,
                name: createdTask.creator.name
            }
        }

        delete task.assignee
        delete task.creator


        return task
    }

    catch (err) {
        throw  err
    }
}

const updateTask = async({roomId, userId, taskId, changes}) => {
    try {
        const user = await prisma.room_members.findUnique({
            where: {
                room_id_user_id: {
                    room_id: roomId,
                    user_id: userId
                }
            },
            select: {
                role: true
            }
        })
        const roomRole = user.role
        const task = await prisma.task.findUnique({
            where: {task_id: taskId}
        })

        const updatingPriority = changes.priority !== undefined
        const updatingStatus = changes.status !== undefined
        const updatingDeadline = changes.deadline !== undefined



        
        if (!task) throw new Error("Task not Found")
            
        if (task.room_id !== roomId) throw new Error("Task doesnot belong to this room")

        if ((updatingPriority || updatingDeadline) && roomRole !== "admin") {
            throw new Error("Only admins can update priority or deadline")
        }
            
        if (updatingStatus && task.assigned_to !== userId) {
            throw new Error("Only the assignee can update task status")
        }
                    
        
        const data = {}

        if (changes.priority) data.priority = changes.priority
        if (changes.status) data.status = changes.status
        if (changes.deadline) data.deadline = new Date(changes.deadline)


        const updatedTask = await prisma.task.update({
            where: {
                task_id: taskId,
            },
            data
        })

        return updatedTask
    }
    catch (err) {
        throw err
    }
}

const deleteTask = async({userId, roomRole, taskId}) => {
    try {
        const task = await prisma.task.findUnique({
            where: {task_id: taskId}
        })

        if (!task) throw new Error("Task not found")
        
        if (task.created_by !== userId && roomRole !== "admin") {
            throw new Error("Only task creator or admin can delete the task")
        }


        await prisma.task.delete({
            where: {task_id: taskId}
        })
    }

    catch (err) {
        throw err
    }
}

module.exports = {getTask, addTask, updateTask, deleteTask}