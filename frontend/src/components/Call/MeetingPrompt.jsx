import { useState } from "react"
import useCallStore from "../../store/callStore"
import useRoomStore from "../../store/roomStore"
import useAuthStore from "../../store/authStore"

const MeetingPrompt = () => {
    const showMeetingPrompt = useCallStore(state => state.showMeetingPrompt)
    console.log("Show Meetig Prompt=", showMeetingPrompt)
    const promptZoneName = useCallStore(state => state.promptZoneName)
    const roomMembers = useRoomStore(state => state.roomMembers)
    const currentUserId = useAuthStore(state => state.user.id)

    const [inviteAll, setInviteAll] = useState(true)
    const [selectedIds, setSelectedIds] = useState([])

    if (!showMeetingPrompt) return null

    const otherMembers = roomMembers.filter(m => m.id !== currentUserId)

    const toggleMember = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    const resetAndClose = () => {
        useCallStore.getState().dismissMeetingPrompt()
        setSelectedIds([])
        setInviteAll(true)
    }

    const handleStart = async() => {
        console.log(useCallStore.getState().emitStateCall?.())
        const started = await useCallStore.getState().emitStartCall?.()
        if (started) {
            useCallStore.getState().emitInviteToCall?.(inviteAll ? "all" : selectedIds)
        }
        resetAndClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="bg-[#22263E] rounded-xl p-6 max-w-sm w-full flex flex-col gap-4">
                <h2 className="text-lg font-bold text-white text-center">Start Meeting?</h2>
                <p className="text-sm text-gray-300 text-center">You've entered {promptZoneName}.</p>

                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-white">
                        <input type="radio" checked={inviteAll} onChange={() => setInviteAll(true)} />
                        Invite everyone in the room
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white">
                        <input type="radio" checked={!inviteAll} onChange={() => setInviteAll(false)} />
                        Choose people
                    </label>
                </div>

                {!inviteAll && (
                    <div className="max-h-40 overflow-y-auto flex flex-col gap-1 border-t border-white/10 pt-2">
                        {otherMembers.map(member => (
                            <label key={member.id} className="flex items-center gap-2 text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(member.id)}
                                    onChange={() => toggleMember(member.id)}
                                />
                                {member.name}
                            </label>
                        ))}
                    </div>
                )}

                <div className="flex justify-center gap-3 pt-2">
                    <button onClick={resetAndClose} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5">
                        Not now
                    </button>
                    <button
                        onClick={handleStart}
                        disabled={!inviteAll && selectedIds.length === 0}
                        className="px-4 py-2 rounded-lg bg-[#6C63FF] hover:bg-[#5951d8] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start Meeting
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MeetingPrompt