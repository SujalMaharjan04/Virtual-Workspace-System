import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAvatarStore = create(
    persist(
        (set) => ({
            id: null,
            setAvatar: (avatarId) => set({id: avatarId}),
            removeAvatar: () => {
                set({id: null})
                localStorage.removeItem("avatarId")
            }
        }),
        {
            "name": "avatarId",   
        }
    )
)

export default useAvatarStore