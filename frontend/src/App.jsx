import AuthPage from "./pages/AuthPage"
import {Routes, Route, Navigate} from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Notification from "./components/Notification"
import useAuthStore from "./store/authStore"
import DashBoard from "./pages/Dashboard"


const App = () => {
  const token = useAuthStore(state => state.token)
  
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