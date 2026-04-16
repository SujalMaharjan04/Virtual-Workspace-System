import AuthPage from "./pages/AuthPage"
import {Routes, Route, Navigate, useNavigate} from "react-router-dom"
import { useEffect } from "react"
import {jwtDecode} from 'jwt-decode'
import ProtectedRoute from "./components/ProtectedRoute"
import Notification from "./components/Notification"
import useAuthStore from "./store/authStore"
import DashBoard from "./pages/Dashboard"
import useRoomStore from "./store/roomStore"
import roomService from './services/room'


const App = () => {
  const token = useAuthStore(state => state.token)
  const logout = useAuthStore(state => state.logout)
  const setRooms = useRoomStore(state => state.setRooms)
  const navigate = useNavigate()

  useEffect(() => {
    try {
        if (token) {
          const {exp} = jwtDecode(token)
        if (Date.now() >= exp * 1000) {
          logout()
          navigate("/auth")
        }
      }
    }
    catch {
      logout()
    }


    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
      const fetchRooms = async() => {
      const getRooms = await roomService.getAllRooms()
      setRooms(getRooms)
    }

    if (!token) return
    fetchRooms()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])
  
  return (
    <div>
      <Notification />
      <Routes>
       <Route path = "/auth" element = {token ? <Navigate to = "/" replace /> : <AuthPage />} />
        
        <Route path = "/" element = {
          <ProtectedRoute>
            <DashBoard />
          </ProtectedRoute>
          } />
      </Routes>
    </div>
  )
}

export default App