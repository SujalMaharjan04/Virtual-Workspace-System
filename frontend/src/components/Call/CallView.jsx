import useCallStore from "../../store/callStore"
import VideoTile from "./VideoTile"

const CallView = () => {
    const inCall = useCallStore(state => state.inCall)
    const localStream = useCallStore(state => state.localStream)
    const peers = useCallStore(state => state.peers)
    const isMuted = useCallStore(state => state.isMuted)
    const isCameraOff = useCallStore(state => state.isCameraOff)
    const toggleMute = useCallStore(state => state.toggleMute)
    const toggleCamera = useCallStore(state => state.toggleCamera)

    if (!inCall) return null

    const peerList = Object.entries(peers)

    const handleLeave = () => {
        useCallStore.getState().emitLeaveCall?.()
    }


    return (
        <div className = "fixed inset-0 bg-[#0f1123] z-50 flex flex-col p-4 " >
            <div className = "flex-1 grid gap-3 overflow-y-auto" style ={{gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`}}>
                
                {localStream && (
                    <VideoTile stream = {localStream} name = "You" muted isLocal />
                )}
                
                {peerList.map(([userId, peer]) => (
                    <VideoTile key = {userId} stream = {peer.stream} name = {peer.userName} />
                ))}
            </div>

            <div className = "flex justify-center items-center gap-4 pt-4">
                <button 
                    onClick = {toggleMute}
                    className = {`w-12 h-12 rounded-full flex items-center justify-center text-white ${isMuted ? "bg-red-600" : "bg-[#22263E] hover:bg-[#2c3050]"}`}
                    aria-label = {isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? "Unmute" : "Mute"}
                </button>

                <button onClick = {toggleCamera} className = {`w-12 h-12 rounded-full flex items-center justify-center text-white ${isCameraOff ? "bg-red-600": "bg-[#22263E] hover:bg-[#2c3050"}`} aria-label= {isCameraOff ? "Turn Camera on" : "Turn Camera Off"}>
                    {isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
                </button>

                <button onClick = {handleLeave} className = "w-12 h-12 rounded-full bg-red-700 hover:bg-red-600 flex items-center justify-center text-white" aria-label = "Leave Call">
                    &#10005;
                </button>
            </div>
        </div>
    )
}

export default CallView