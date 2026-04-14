import { Navigate } from "react-router-dom";
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token)
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)

    if (!token || !isAuthenticated) {
        return <Navigate to = "/" />
    }

    return children

}

export default ProtectedRoute