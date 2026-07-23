const {CALL_EVENTS }= require("../events")


const registerCallHandler = async(io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId
    const userName = socket.userName

    socket.inCall = false
    //users join call
    socket.on(CALL_EVENTS.JOIN_CALL, async() => {
        try {
            socket.inCall = true
            const sockets = await io.in(roomId).fetchSockets()
            const otherSockets = sockets.filter(s => s.userId !== userId && s.inCall)

            //send existing member to new user
            socket.emit(CALL_EVENTS.EXISTING_MEMBER, {
                member: otherSockets.map(m => ({
                    userId: m.userId,
                    userName: m.userName
                }))
            })

            //user joins call
            socket.to(roomId).emit(CALL_EVENTS.USER_JOINED_CALL, {
                userId,
                userName
            })
        }
        catch (err) {
            socket.emit("error", {message: err.message})
        }
    })

    //forward offer to target user
    socket.on(CALL_EVENTS.CALL_OFFER, async(data) => {
        try {            
            const sockets = await io.in(roomId).fetchSockets()           
            const targetSocket = await sockets.find(s => s.userId === data.userId)

            if (!targetSocket) return
            io.to(targetSocket.id).emit(CALL_EVENTS.CALL_OFFER, {
                offer: data.offer,
                callerId: userId,
                callerName: userName
            })
        }

        catch (err) {
            socket.emit('error', {message: err.message})
        }
    })

    //forward answer to caller
    socket.on(CALL_EVENTS.CALL_ANSWER, async(data) => {
        try {
            const sockets = await io.in(roomId).fetchSockets()
            const targetSocket = await sockets.find(s => s.userId === data.userId)

            if (!targetSocket) return

            io.to(targetSocket.id).emit(CALL_EVENTS.CALL_ANSWER, {
                answer: data.answer,
                answerId: userId
            })
        }

        catch (err) {
            socket.emit("error", {message: err.message})
        }
    })

    //forward ICE candidate
    socket.on(CALL_EVENTS.ICE_CANDIDATE, async(data) => {
        try {
            const sockets = await io.in(roomId).fetchSockets()
            const targetSocket = await sockets.find(s => s.userId === data.userId)

            if (!targetSocket) return

            io.to(targetSocket.id).emit(CALL_EVENTS.ICE_CANDIDATE, {
                candidate: data.candidate,
                fromUser: userId
            })
        }

        catch (err) {
            socket.emit("error", {message: err.message})
        }
    })

    socket.on(CALL_EVENTS.INVITE_TO_CALL, async({targetUserIds}) => {
        try {
            const sockets = await io.in(roomId).fetchSockets()
            const targets = targetUserIds === "all"
                ? sockets.filter(s => s.userId !== userId)
                : sockets.filter(s => targetUserIds.includes(s.userId))

            targets.forEach(s => {
                io.to(s.id).emit(CALL_EVENTS.CALL_INVITE, {
                    fromUserId: userId,
                    fromUserName: userName
                })
            })
        } catch (err) {
            socket.emit("error", {message: err.message})
        }
    })

    //user leaves call
    socket.on(CALL_EVENTS.LEAVE_CALL, async() => {
        try {
            socket.inCall = false
            socket.to(roomId).emit(CALL_EVENTS.USER_LEFT_CALL, {
                userId,
                userName
            })
        }
        catch (err) {
            socket.emit('error', {message: err.message})
        }
    })

    //handle disconnect during call
    socket.on("disconnect", async() => {
        socket.inCall = false
        socket.to(roomId).emit(CALL_EVENTS.USER_LEFT_CALL, {
            userId,
            userName
        })
    })
}

module.exports = registerCallHandler