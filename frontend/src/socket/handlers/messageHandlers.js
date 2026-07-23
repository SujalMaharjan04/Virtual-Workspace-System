import { getSocket } from "../index";
import { MESSAGE_EVENTS } from "../events";
import useMessageStore from "../../store/messageStore";
import useRoomStore from "../../store/roomStore";
import { decryptMessage } from "../../utils/messageHelper";

const registerMessageHandler = () => {
    const socket = getSocket()
    const roomId = useRoomStore.getState().room.room_id

    useMessageStore.getState().registerEmitSend((roomId, message, vectorClock) => {
        // console.log("RoomID:", roomId)
        // console.log("Message", message)
        // console.log("VectorClock", vectorClock)
        if (message.receiver.name === "All") {
            socket.emit(MESSAGE_EVENTS.SEND_ALL, ({roomId, message, vectorClock}))
        } else {
            socket.emit(MESSAGE_EVENTS.SEND_DM, ({roomId, message, vectorClock}))
        }
    }) 

    socket.on(MESSAGE_EVENTS.RECEIVE_ALL, async(data) => {
        const addMessage = useMessageStore.getState().addMessage
        const aesKey = useRoomStore.getState().aesKey

        try {
            const decryptedContent = await decryptMessage(aesKey, data.content, data.iv)

            addMessage({
                roomId, 
                message: {
                    content: decryptedContent,
                    sender: data.sender,
                    receiver: data.receiver,
                    time: Date.now(),
                    vectorClock: data.vectorClock,
                }
            })
        } catch (err) {
            console.log("Failed to decrypt the incoming message", err.message)
        }
    })
    
    socket.on(MESSAGE_EVENTS.RECEIVE_DM, async (data) => {
        console.log("RECEIVED DM")
        const addMessage = useMessageStore.getState().addMessage
        const aesKey = useRoomStore.getState().aesKey


        try {
            console.log(aesKey)
            const decryptedContent = await decryptMessage(aesKey, data.content, data.iv)
            console.log(decryptedContent)
            addMessage({
                roomId, 
                message: {
                    content: decryptedContent,
                    sender: data.sender,
                    receiver: data.receiver,
                    time: Date.now(),
                    vectorClock: data.vectorClock,
                }
            })
        } catch (err) {
            console.log("Failed to decrypt the incoming message", err.message)
        }
    })

    socket.on(MESSAGE_EVENTS.RECEIVE_HISTORY, async(messages) => {
        const aesKey = useRoomStore.getState().aesKey
        const addMessage = useMessageStore.getState().addMessage

        for (const msg of messages) {
            try {
                const decrypted = await decryptMessage(aesKey, msg.message, msg.iv)
                addMessage({
                    roomId, 
                    message: {
                        content: decrypted,
                        sender: msg.sender.name,
                        receiver: msg.sent_to ?? "All",
                        time: Date.now(),
                        vectorClock: msg.vectorClock
                    }
                })
            } catch (err) {
                console.log("Error decrypting the message history", err.message)
            }
        }
    })
}

export default registerMessageHandler
