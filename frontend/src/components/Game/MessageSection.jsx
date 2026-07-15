import {useState, useEffect, useRef} from "react"
import useMessageStore from "../../store/messageStore"
import useRoomStore from "../../store/roomStore"
import useAuthStore from "../../store/authStore"
import useAvatarStore from "../../store/avatarStore"
import { encryptMessage } from "../../utils/messageHelper"

const MessageSection = () => {
    const [isMsgActive, setIsMsgActive] = useState(false)
    const [isReceiverActive, setIsReceiverActive] = useState(false)
    const [message, setMessage] = useState('')
    const [receiver, setReceiver] = useState('All')
    const {room} = useRoomStore.getState()
    const otherPlayer = useAvatarStore(state => state.otherPlayer) || {}
    const receivers = Object.entries(otherPlayer)?.map(([userId, data]) => ({
        userId,
        userName: data.userName
    }))
    const roomId = room.room_id
    const {user} = useAuthStore.getState()
    const userId = user.id
    const userName = user.name
    const messages = useMessageStore(state => state.messages[roomId]) || []
    const sendMessage = useMessageStore(state => state.sendMessage)
    const inputRef = useRef(null)
    const receiverRef = useRef(null)
    const messageRef = useRef("")
    const aesKey = useRoomStore(state => state.aesKey)
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            //Only active when the enter key is pressed and if not already active
            if (e.key === "Enter" && !isMsgActive) {
                e.preventDefault()
                setIsMsgActive(true)
            } else if (e.key === "Enter" && isMsgActive) {
                if (!messageRef.current.trim()) {
                    setIsMsgActive(false)
                } else {
                    handleSend()
                }
            }

            if (e.key === "Tab" && !isReceiverActive) {
                e.preventDefault()
                setIsReceiverActive(true)
            } else if (e.key === "Tab" && isReceiverActive) {
                setIsReceiverActive(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isMsgActive, isReceiverActive])

    useEffect(() => {
        if (isMsgActive && inputRef.current) {
            inputRef.current.focus()
        } else if (isReceiverActive && receiverRef.current) {
            receiverRef.current.focus()
        } else {
            document.activeElement?.blur()
        }

    }, [isMsgActive, isReceiverActive])

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
        messageRef.current = e.target.value
    }

    const handleReceiverFocus = () => {
        if (receiver === "All") {
            setReceiver("")
        }
    }

    const handleReceiverBlur = () => {
        if (!receiver.trim()) {
            setReceiver("All")
        }
    }

    const handleSend = async() => {
        if (!messageRef.current.trim()) return

        const vectorClock = useMessageStore.getState().tickClock()
        let receiverValue = "All"

        if (receiver.trim() !== "All") {

            const selectedUser = receivers.find(
                r => r.userName === receiver
            )

            if (!selectedUser) {
                console.log("Receiver not found")
                return
            }

            receiverValue = selectedUser.userId
        }

        const messageContent = await encryptMessage(aesKey, messageRef.current)

        const msgToSend = {
            content: messageContent.message,
            iv: messageContent.iv,
            sender: {
                name: userName,
                id: userId
            },
            receiver: {
                name: receiver,
                id: receiverValue
            },
            time: Date.now()
        }
        console.log("msgToSend", msgToSend)
        setMessage("")
        messageRef.current = ""

        sendMessage(roomId, msgToSend, vectorClock)
    }

    return (
        <div className = "bg-black opacity-65">
            <div className = "gap-2">
                {(isMsgActive && messages.length > 0) && (
                    <div className = "flex flex-col gap-2 max-h-50 overflow-auto">
                        {messages.map(msg => (
                            <div id = {msg.id} className = "inline-flex items-start gap-2">
                                {msg.receiver.name === "All" ? <span className = "text-green-500">{msg.sender.name}:</span> : <span className = "text-purple-500">{msg.sender.name}:</span> }
                                
                                <span>{msg.content}</span>
                            </div>
                        ))}
                    </div>
                ) } 

                <div className = "flex justify-start items-center w-full">
                    <input list = "receivers" ref = {receiverRef} type = "text" name = "receiver" className = "text-center w-[15%]" value = {receiver} onChange = {(e) => setReceiver(e.target.value)} onFocus={handleReceiverFocus} onBlur={handleReceiverBlur} />
                    <datalist id = "receivers">
                        <option value = "all" />
                        {receivers.map(rm => (
                            <option key = {rm.userId} value = {rm.userName} />
                        ))}
                    </datalist>
                    <input ref = {inputRef} type = "text" name = "message" value = {message} className = "flex-1 text-white pl-2 placeholder:text-white" disabled = {!isMsgActive} placeholder = "Press Enter to Type" onChange = {(e) => handleMessageChange(e)} /> 
                </div>
            </div>
        </div>
    )
}

export default MessageSection