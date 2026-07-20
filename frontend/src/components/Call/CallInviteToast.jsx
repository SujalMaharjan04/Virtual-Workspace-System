import useCallStore from "../../store/callStore"

const CallInviteToast = () => {
    const incomingInvite = useCallStore(state => state.incomingInvite)

    if (!incomingInvite) return null

    const handleJoin = () => {
        useCallStore.getState().emitStartCall?.()
        useCallStore.getState().clearIncomingInvite()
    }

    const handleDismiss = () => {
        useCallStore.getState().clearIncomingInvite()
    }

    return (
        <div className="fixed top-4 right-4 z-50 bg-[#22263E] border border-white/10 rounded-xl p-4 flex flex-col gap-3 w-64 shadow-lg">
            <p className="text-sm text-white">
                <span className="font-bold">{incomingInvite.fromUserName}</span> invited you to a meeting
            </p>
            <div className="flex justify-end gap-2">
                <button onClick={handleDismiss} className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-white/5">
                    Dismiss
                </button>
                <button onClick={handleJoin} className="px-3 py-1.5 rounded-lg text-xs bg-[#6C63FF] hover:bg-[#5951d8] text-white">
                    Join
                </button>
            </div>
        </div>
    )
}

export default CallInviteToast