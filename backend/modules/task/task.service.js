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
                }
            })
        }

        return tasks
    }
    catch (err) {
        throw err
    }
}

const addTask = async({roomId, userId, targetUser, newTask}) => {
    try {
        const task = await prisma.task.create({
            data: {
                room_id: roomId,
                assigned_to: targetUser || userId,
                created_by: userId,
                task: newTask
            }
        })

        if (!task) {
            throw new Error("Task assignment failed")
        }

        return task
    }

    catch (err) {
        throw  err
    }
}

const checkTask = async({roomId, userId, taskId}) => {
    try {
        const task = await prisma.task.findUnique({
            where: {task_id: taskId}
        })

        if (!task) throw new Error("Task not Found")

        const checked = await prisma.task.update({
            where: {
                task_id: taskId,
            },
            data: {completed: !task.completed}
        })

        return checked
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

module.exports = {getTask, addTask, checkTask, deleteTask}