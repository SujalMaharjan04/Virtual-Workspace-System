import { useState } from "react"
import useRoomStore from "../../store/roomStore"
import {LuClipboard, LuClipboardCheck} from "react-icons/lu"

const GetRoomCode = () => {
    const roomId = useRoomStore(state => state.room.room_id)
    const [copied, setCopied] = useState(false)

    const handleCopy = async() => {
        await navigator.clipboard.writeText(roomId)
        setCopied(true)
    }
    return (
        <div className = "flex flex-col justify-center items-center gap-2 h-full">
            <div className = "pt-10">
                <h1 className = "text-4xl font-bold">Room Code:</h1>
            </div>

            <div className = "flex-1 flex items-center justify-center">
                <div className="px-6 py-1 border border-gray-500 rounded-lg bg-[#1a1d2e] text-2xl font-mono tracking-widest">
                    {roomId}
                </div>
                <button onClick = {handleCopy} className = "submitBtn flex items-center gap-2">
                    {copied ? (
                        <LuClipboardCheck size = {20} />
                    )
                    : (
                        <LuClipboard size = {20} />
                    )}
                    {copied ? "Copied" : "Copy"}
                    
                </button>
            </div>
        </div>
    )
}

export default GetRoomCode