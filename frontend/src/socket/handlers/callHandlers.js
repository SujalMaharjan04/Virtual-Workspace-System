import { getSocket } from "../index";
import { CALL_EVENTS } from "../events";
import useCallStore from "../../store/callStore";
import createPeerConnection from "../../utils/peerConnection"
import callService from '../../services/call'
import useNotificationStore from "../../store/notificationStore";

const registerCallHandler = () => {
    console.log("Call hander")
    const socket = getSocket()

    const sendIceCandidate = (targetUserId, candidate) => {
        socket.emit(CALL_EVENTS.ICE_CANDIDATE, {userId: targetUserId, candidate})
    }

    const inviteToCall = (targetUserIds) => {
        socket.emit(CALL_EVENTS.INVITE_TO_CALL, {targetUserIds})
    }

    const onCallInvite = ({fromUserId, fromUserName}) => {
        if (useCallStore.getState().inCall) return 
        useCallStore.getState().setIncomingInvite({fromUserId, fromUserName})
    }

    const startCall = async() => {
      try  { 
            const localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
            useCallStore.getState().setLocalStream(localStream)

            const rtcConfig = await callService.getRTCConfig()
            useCallStore.getState().setRTCConfig(rtcConfig)

            useCallStore.getState().setInCall(true)
            socket.emit(CALL_EVENTS.JOIN_CALL)
            return true
        } catch (err) {
            console.log("Error starting call", err)
            const message = err.name === "NotAllowedError" ? "Camera/mic permission denied"
                : err.name === "NotFoundError" ? "No camera or microphone found"
                : "Could not start call"
            useNotificationStore.getState().setNotification(message, "error")
            setTimeout(() => useNotificationStore.getState().clearNotification(), 5000)
            return false
        }
    }

    const leaveCall = () => {
        socket.emit(CALL_EVENTS.LEAVE_CALL)
        useCallStore.getState().endCall()
    }

    useCallStore.getState().registerCallAction({startCall, leaveCall, inviteToCall})
    console.log(useCallStore.getState().emitStartCall)

    const onExistingMember = async({member}) => {
        for (const {userId, userName} of member) {
            const connection = createPeerConnection(userId, userName, sendIceCandidate)
            const offer = await connection.createOffer()
            await connection.setLocalDescription(offer)
            socket.emit(CALL_EVENTS.CALL_OFFER, {userId, offer})
        }
    }

    const onUserJoinedCall = ({userId, userName}) => {
        useCallStore.getState().addPeer(userId, {userName, connection: null, stream: null})
    }

    const onCallOffer = async({offer, callerId, callerName}) => {
        const connection = createPeerConnection(callerId, callerName, sendIceCandidate)
        await connection.setRemoteDescription(new RTCSessionDescription(offer))

        const answer = await connection.createAnswer()
        await connection.setLocalDescription(answer)

        socket.emit(CALL_EVENTS.CALL_ANSWER, {userId: callerId, answer})
    }

    const onCallAnswer = async({answer, answerId}) => {
        const peer = useCallStore.getState().peers[answerId]
        if (!peer?.connection) return
        await peer.connection.setRemoteDescription(new RTCSessionDescription(answer))
    }

    const onIceCandidate = async({candidate, fromUser}) => {
        const peer = useCallStore.getState().peers[fromUser]
        if (!peer?.connection) return
        try {
            await peer.connection.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (err) {
            console.log("Error adding ICE candidate", err)
        }
    }

    const onUserLeftCall = ({userId}) => {
        useCallStore.getState().removePeer(userId)
    }

    socket.on(CALL_EVENTS.EXISTING_MEMBER, onExistingMember)
    socket.on(CALL_EVENTS.USER_JOINED_CALL, onUserJoinedCall)
    socket.on(CALL_EVENTS.CALL_OFFER, onCallOffer)
    socket.on(CALL_EVENTS.CALL_ANSWER, onCallAnswer)
    socket.on(CALL_EVENTS.ICE_CANDIDATE, onIceCandidate)
    socket.on(CALL_EVENTS.USER_LEFT_CALL, onUserLeftCall)
    socket.on(CALL_EVENTS.CALL_INVITE, onCallInvite)
    
    return () => {
        socket.off(CALL_EVENTS.EXISTING_MEMBER, onExistingMember)
        socket.off(CALL_EVENTS.USER_JOINED_CALL, onUserJoinedCall)
        socket.off(CALL_EVENTS.CALL_OFFER, onCallOffer)
        socket.off(CALL_EVENTS.CALL_ANSWER, onCallAnswer)
        socket.off(CALL_EVENTS.ICE_CANDIDATE, onIceCandidate)
        socket.off(CALL_EVENTS.USER_LEFT_CALL, onUserLeftCall)
        socket.off(CALL_EVENTS.CALL_INVITE, onCallInvite)
    }
}

export default registerCallHandler