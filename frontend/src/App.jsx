import AuthPage from "./pages/AuthPage"
import {Routes, Route, Navigate, useNavigate} from "react-router-dom"
import { useEffect } from "react"
import {jwtDecode} from 'jwt-decode'
import ProtectedRoute from "./components/ProtectedRoute"
import Notification from "./components/Shared/Notification"
import useAuthStore from "./store/authStore"
import DashBoard from "./pages/Dashboard"
import RoomJoined from "./pages/RoomJoined"
import ProtectedRoom from "./components/ProtectedRoom"


const App = () => {
  const token = useAuthStore(state => state.token)
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()

  // useEffect(() => {
  //   try {
  //       if (token) {
  //         const {exp} = jwtDecode(token)
  //       if (Date.now() >= exp * 1000) {
  //         logout()
  //         navigate("/auth")
  //       }
  //     }
  //   }
  //   catch {
  //     logout()
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [token])


  
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

          <Route path = "/:id" element = {
            <ProtectedRoute>
              <ProtectedRoom>
                  <RoomJoined />  
              </ProtectedRoom>              
            </ProtectedRoute>
          } />
      </Routes>
    </div>
  )
}

export default App