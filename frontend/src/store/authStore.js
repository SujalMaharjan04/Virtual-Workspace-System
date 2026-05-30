import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,

            setUser: (user) => set({user}),
            setToken: (token) => set({token}),
            logout: () => {
                // localStorage.removeItem('logged')
                sessionStorage.removeItem("logged")
                set({user: null, token: null})
            }
        }), 
        // {
        //     name: "logged",
        //     partialize: (state) => ({
        //         token: state.token,
        //         user: state.user
        //     })
        // }
        {
            name: "logged",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                token: state.token,
                user: state.user
            })
        }
    )
)
export default useAuthStore