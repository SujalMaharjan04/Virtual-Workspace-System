const config = require("../../utils/config")
const bcrypt = require('bcrypt')
const prisma = require("../../src/db")
const jwt = require('jsonwebtoken')

const generateRoomId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const createRoom = async({roomName, password, userId, userName}) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        let room_id
        let isUnique = false

        while (!isUnique) {
            room_id = generateRoomId()
            
            const existing = await prisma.room.findUnique({
                where: {room_id}
            })

            if (!existing) {
                isUnique = true
            }
        }

        const room = await prisma.room.create({
            data: {
                room_id, 
                room_name: roomName, 
                room_password: hashedPassword,
                created_by: userId
            }
        })

        const member = await prisma.room_members.create({
            data: {
                room_id: room.room_id,
                user_id: userId,
                role: "admin"
            }
        })
        
        const payload = {userId: userId, roomId: room_id, userName, roomRole: member.role}
        const token = jwt.sign(payload, config.SECRET, {expiresIn: "1D"})

        return {token, room: {id: room.room_id, name: room.room_name, isActive: room.is_active, createdBy: room.created_by}}
    }

    catch (error) {
        throw error
    }
}

const joinRoom = async({roomId, password, userId, userName}) => {
    try {
        const room = await prisma.room.findUnique({
            where: {room_id: roomId}
        })

        if (!room) throw new Error("No Room with that id found")

        const roomActive = room.is_active
        const isAdmin = room.created_by === userId

        if (!roomActive && !isAdmin) throw new Error("Room is not Active")

        const passwordCheck = await bcrypt.compare(password, room.room_password)

        if (!passwordCheck) throw new Error('Password incorrect')

        

        const member = await prisma.room_members.upsert({
            where: {
                room_id_user_id: {room_id: roomId, user_id: userId},
            },
            update: {is_active: true},
            create: {
                room_id: roomId,
                user_id: userId,
                role: isAdmin ? "admin" : "member"
            }
        })

        const payload = {userId: userId, roomId: room.room_id, userName, roomRole: member.role}

        const token = jwt.sign(payload, config.SECRET, {expiresIn: "1D"})

        return {token, room: {id: room.room_id, name: room.room_name, isActive: room.is_active, createdBy: room.created_by}}
    }
    catch (error) {
        throw error
    }
}

const leaveRoom = async({roomId, userId}) => {
    try {
        const member = await prisma.room_members.update({
            where: {
                room_id_user_id: {room_id: roomId, user_id: userId}
            },
            data: {
                is_active: false,
            }
        })

        if (member.role === "admin") {
            await prisma.room.update({
                where: {room_id: roomId},
                data: {is_active: false}
            })
        }

    }

    catch (err) {
        throw err
    }
}

const getRoomMember = async({roomId}) => {
    try {
        const members = await prisma.room_members.findMany({
            where: {room_id: roomId, is_active: true},
            include: {
                user: {
                    select: {user_id: true, name: true}
                }
            }
        })

        return members
    }
    catch (err) {
        throw err
    }
}

module.exports = {createRoom, joinRoom, getRoomMember, leaveRoom}