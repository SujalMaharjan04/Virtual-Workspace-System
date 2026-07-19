import { useEffect, useRef } from "react";

const VideoTile = ({stream, name, muted = false, isLocal = false}) => {
    const videoRef = useRef()

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream
        }
    }, [stream])

    return (
        <div className = "relative bg-[#1a1d33] rounded-xl overflow-hidden aspect-video flex items-center justify-center ">
            {stream
                ? (
                    <video
                        ref = {videoRef}
                        autoPlay
                        playsInline
                        muted = {muted}
                        className = {`w-full h-full object-cover ${isLocal ? "scale-x-[1]" : ""}`}
                    />
                )
                : (
                    <div className = "flex flex-col items-center gap-2 text-gray-400">
                        <div className = "w-12 h-12 rounded-full bg-[#22263E] flex items-center justify-center text-lg font-bold">
                            {name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className = "text-xs">Connecting...</span>
                    </div>
                )
            }
            <span className = "absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded-md">
            {isLocal ? "You" : name}
            </span>
        </div>
    )
}



export default VideoTile