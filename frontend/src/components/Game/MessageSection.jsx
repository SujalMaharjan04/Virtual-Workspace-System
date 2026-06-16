import {useState, useEffect, useRef} from "react"
import useMessageStore from "../../store/messageStore"
import useRoomStore from "../../store/roomStore"
import useAuthStore from "../../store/authStore"
import useAvatarStore from "../../store/avatarStore"

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
    const userName = user.name
    const messages = useMessageStore(state => state.messages[roomId]) || []
    const sendMessage = useMessageStore(state => state.sendMessage)
    const inputRef = useRef(null)
    const receiverRef = useRef(null)
    const messageRef = useRef("")

    
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
        } 
        
        if (!isMsgActive && inputRef.current) {
            inputRef.current.blur()
        }

        if (isReceiverActive && receiverRef.current) {
            receiverRef.current.focus()
        }

        if (!isReceiverActive) {
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

    const handleSend = () => {
        if (!messageRef.current.trim()) return

        const vectorClock = useMessageStore.getState().tickClock()
        const finalReceiver = receiver.trim() || "All"

        const msgToSend = {
            content: messageRef.current,
            sender: userName,
            receiver: finalReceiver,
            time: Date.now()
        }

        sendMessage(roomId, msgToSend, vectorClock)
    }

    return (
        <div className = "bg-black opacity-65">
            <div>
                {/* {(isActive || messages.length > 0) && ( */}
                    <div className = "flex flex-col gap-2 max-h-25 overflow-auto pb-2">
                        {messages.map(msg => (
                            <div id = {msg.id} className = "inline-flex items-start">
                                <span>{msg.userName}</span>
                                <span>{msg.content}</span>
                            </div>
                        ))}
                    </div>
                {/* ) } */}

                <div className = "flex justify-start items-center gap-0">
                    <input list = "receivers" ref = {receiverRef} type = "text" name = "receiver" className = "text-center w-[15%]" value = {receiver} onChange = {(e) => setReceiver(e.target.value)} onFocus={handleReceiverFocus} onBlur={handleReceiverBlur} />
                    <datalist id = "receivers">
                        <option value = "all" />
                        {receivers.map(rm => (
                            <option key = {rm.userId} value = {rm.userName} />
                        ))}
                    </datalist>
                    <input ref = {inputRef} type = "text" name = "message" className = " text-white pl-2 placeholder:text-white" disabled = {!isMsgActive} placeholder = "Press Enter to Type" onChange = {(e) => handleMessageChange(e)} /> 
                </div>
            </div>
        </div>
    )
}

export default MessageSection