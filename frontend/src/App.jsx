import AuthPage from "./pages/AuthPage"
import {Routes, Route} from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Notification from "./components/Notification"


const App = () => {

  return (
    <div>
      <Notification />
      <Routes>
        <Route path = "/" element = {<AuthPage />} />
        
        <Route path = "/dashboard" element = {
          <ProtectedRoute>
            <h1>Hello</h1>
          </ProtectedRoute>
          } />
      </Routes>
    </div>
  )
}

export default App