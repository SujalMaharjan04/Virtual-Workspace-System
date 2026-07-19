import { create } from "zustand";

const useCallStore = create((set, get) => ({
    inCall: false,
    localStream: null,
    rtcConfig: null,

    peers: {},

    isMuted: false,
    isCameraOff: false,

    incomingInvite: null,
    emitInviteToCall: null,

    emitStartCall: null,
    emitLeaveCall: null,

    activeMeetingZone: null,
    showMeetingPrompt: false,
    promptZoneName: null,
    dismissedZone: null,

    registerCallAction: ({startCall, leaveCall, inviteToCall}) => set({
        emitStartCall: startCall,
        emitLeaveCall: leaveCall,
        emitInviteToCall: inviteToCall
    }),

    setIncomingInvite: (invite) => set({incomingInvite: invite}),
    clearIncomingInvite: () => set({incomingInvite: null}),

    setRTCConfig: (rtcConfig) => set({rtcConfig}),
    setLocalStream: (localStream) => set({localStream}),
    setInCall: (inCall) => set({inCall}),

    addPeer: (userId, peerData) => set((state) => ({
        peers: {...state.peers, [userId]: {...(state.peers[userId] || {}), ...peerData}}
    })),

    setPeerStream: (userId, stream) => set((state) => {
        if (!state.peers[userId]) return state

        return {
            peers: {
                ...state.peers,
                [userId]: {...state.peers[userId], stream}
            }
        }
    }),

    enterMeetingZone: (zoneName) => set((state) => {
        console.log("Entering the meeting",zoneName)
        if (state.inCall) return {activeMeetingZone: zoneName}
        if (state.dismissedZone === zoneName) return {activeMeetingZone: zoneName}
        return {
            activeMeetingZone: zoneName,
            showMeetingPrompt: true,
            promptZoneName: zoneName
        }
    }),

    exitMeetingZone: () => set({
        activeMeetingZone: null,
        showMeetingPrompt: false,
        promptZoneName: null,
        dismissedZone: null
    }),

    dismissMeetingPrompt: () => set((state) => ({
        showMeetingPrompt: false,
        dismissedZone: state.promptZoneName
    })),

    removePeer: (userId) => set((state) => {
        const peer = state.peers[userId]
        if (peer?.connection) {
            peer.connection.close()
        }

        const { [userId]: removed, ...rest} = state.peers
        return {peers: rest}
    }),

    toggleMute: () => {
        const {localStream, isMuted} = get()
        localStream?.getAudioTracks().forEach(track => {
            track.enabled = isMuted
        })
        set({isMuted: !isMuted})
    },

    toggleCamera: () => {
        const {localStream, isCameraOff} = get()

        localStream?.getVideoTracks().forEach(track => {
            track.enabled = isCameraOff
        })
        set({isCameraOff: !isCameraOff})
    },

    endCall: () => {
        const {localStream, peers} = get()
        localStream?.getTracks().forEach(track => track.stop())

        Object.values(peers).forEach(peer => peer.connection?.close())

        set({
            inCall: false,
            localStream: null,
            peers: {},
            isMuted: false,
            isCameraOff: false
        })
    }
}))

export default useCallStore