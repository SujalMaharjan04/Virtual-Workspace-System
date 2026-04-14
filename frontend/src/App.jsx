import AuthPage from "./pages/AuthPage"
import {Routes, Route, useNavigate} from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Notification from "./components/Notification"
import useAuthStore from "./store/authStore"


const App = () => {
  const token = useAuthStore(state => state.token)
  const navigate = useNavigate()
  return (
    <div>
      <Notification />
      <Routes>
        {token 
            ? navigate('/')
            : <Route path = "/auth" element = {<AuthPage />} />} 
        
        <Route path = "/" element = {
          <ProtectedRoute>
            <h1>Hello</h1>
          </ProtectedRoute>
          } />
      </Routes>
    </div>
  )
}

export default App