const prisma = require('../../src/db')

const getTask = async({roomId, userId}) => {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                room_id: roomId,
                assigned_to: userId 
            },
            include: {
                assignee: {select: {name: true, user_id: true}},
                creator: {select: {name: true, user_id: true}}
            }
        })

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
        const checked = await prisma.task.update({
            where: {
                task_id: taskId,
                room_id: roomId, 
                assigned_to: userId
            },
            data: {completed: !completed}
        })

        return checked
    }
    catch (err) {
        throw err
    }
}

module.exports = {getTask, addTask, checkTask}