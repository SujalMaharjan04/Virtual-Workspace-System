import useCallStore from "../store/callStore";

const createPeerConnection = (targetUserId, targetUserName, onIceCandidate) => {
    const {rtcConfig, localStream} = useCallStore.getState()

    const connection = new RTCPeerConnection(rtcConfig)
    
    localStream?.getTracks().forEach(track => {

        connection.addTrack(track, localStream)
    })

    connection.onicecandidate = (event) => {
        if (event.candidate) {
            onIceCandidate(targetUserId, event.candidate)
        }
    }

    connection.ontrack = (event) => {
        const stream = event.streams?.[0] ?? new MediaStream([event.track])
        useCallStore.getState().setPeerStream(targetUserId, stream)
    }

    connection.onconnectionstatechange = () => {
        if (["failed", "closed", "disconnected"].includes(connection.connectionState)) {
            console.log(`Peer connection with ${targetUserId} ${connection.connectionState}`)
        }
    }

    useCallStore.getState().addPeer(targetUserId, {connection, userName: targetUserName, stream: null})

    return connection
}

export default createPeerConnection