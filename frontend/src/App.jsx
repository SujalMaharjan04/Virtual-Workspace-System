import AuthPage from "./pages/AuthPage"
import {Routes, Route, Navigate} from "react-router-dom"
import { useEffect } from "react"
import {jwtDecode} from 'jwt-decode'
import ProtectedRoute from "./components/ProtectedRoute"
import Notification from "./components/Notification"
import useAuthStore from "./store/authStore"
import DashBoard from "./pages/Dashboard"


const App = () => {
  const token = useAuthStore(state => state.token)
  const logout = useAuthStore(state => state.logout)

  useEffect(() => {
    try {
      const {exp} = jwtDecode(token)
      if (Date.now() >= exp * 1000) {
        logout()
        window.location.href = "/auth"
      }
    }
    catch {
      logout()
    }
  })
  
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