import {create} from 'zustand'
import {persist} from 'zustand/middleware'

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setUser: (user) => set({user, isAuthenticated: true}),
            setToken: (token) => set({token}),
            logout: () => {
                localStorage.removeItem('logged')
                set({user: null, token: null, isAuthenticated: false})
            }
        }), 
        {
            name: "logged",
            partialize: (state) => ({
                token: state.token,
                user: state.user
            })
        }
    )
)
export default useAuthStore