import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useAvatarStore = create(
        subscribeWithSelector((set, get) => ({
            // Local Player Position
            localPlayer: {
                x: 0,
                y: 0,
                direction: "down",
                avatarId: null,
                userName: null
            },
            //Other Player - {userId: {x, y, direction, avatarId, userName}}
            otherPlayer: {},
            emitJoined: null,
            emitMoved: null,

            registerEmitJoined: (fn) => set({emitJoined: fn}),
            registerEmitMoved: (fn) => set({emitMoved: fn}),

            joinRoom: ({userId, avatarId, roomId}) => {
                const {emitJoined} = get()
                if (emitJoined) {
                    emitJoined({userId, avatarId, roomId})
                }
            },

            moveAvatar: ({userId, roomId, avatarId, x, y, direction}) => {
                const {emitMoved} = get()
                if (emitMoved) {
                    emitMoved({userId, roomId, avatarId, x, y, direction})
                }
            },

            //Set Local Player Initially
            setLocalPlayer: (data) => {
                set({localPlayer: data})
            },

            //Update Local Player Position
            updateLocalPlayer: ({x, y, direction}) => {
                set((state) => ({
                    localPlayer: {
                        ...state.localPlayer,
                        x, y, 
                        direction
                    }
                }))
            },

            // Other Player Actions

            //Called when other players joins the room
            addPlayer: ({userId, userName, x, y, direction = "down", avatarId}) => {
                set((state) => ({
                    otherPlayer: {
                        ...state.otherPlayer,
                        [userId]: {
                            userName, 
                            avatarId,
                            x, y, 
                            direction,
                            targetX: x,
                            targetY: y
                        }
                    }
                }))
            },

            //Called when the socket receives avatar:moved event
            updatePlayerPosition: ({userId, x, y, direction, avatarId}) => {
                set((state) => {
                    if (!state.otherPlayer[userId]) return state

                    return {
                        otherPlayer: {
                            ...state.otherPlayer,
                            [userId]: {
                                ...state.otherPlayer[userId],
                                targetX: x,
                                targetY: y,
                                direction,
                                avatarId: avatarId || state.otherPlayer[userId].avatarId
                            }
                        }
                    }
                })
            },

            //Called when the socket receives full room info on join
            setAllPlayer: (avatars) => {
                const playerMap = {}
                avatars.forEach(avatar => {
                    playerMap[avatar.userId] = {
                        ...avatar,
                        targetX: avatar.x,
                        targetY: avatar.y
                    }
                })

                set({otherPlayer: playerMap})
            },

            removeUser: () => {
                set({localPlayer: null})
            },
            //Called when a user disconnects
            removePlayer: (userId) => {
                set((state) => {
                    const updated = {...state.otherPlayer}
                    delete updated[userId]
                    return {otherPlayer: updated}
                })
            },

            //Clear all Players when leaving room
            clearPlayer: () => set({otherPlayer: {}}),



        }))
)

export default useAvatarStore