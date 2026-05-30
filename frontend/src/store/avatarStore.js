import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAvatarStore = create(
    persist(
        (set) => ({
            id: null,
            setAvatar: (avatarId) => set({id: avatarId}),
            removeAvatar: () => {
                set({id: null})
                // localStorage.removeItem("avatarId")
                sessionStorage.removeItem("avatarId")
            }
        }),
        // {
        //     name: "avatarId",   
        // }
        {
            name: "avatarId",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)

export default useAvatarStore