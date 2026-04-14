import { Navigate } from "react-router-dom";
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token)
    if (!token) {
        return <Navigate to = "/auth" />
    }

    return children

}

export default ProtectedRoute