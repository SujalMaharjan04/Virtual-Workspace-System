import AuthPage from "./pages/AuthPage"
import {Routes, Route} from "react-router-dom"


const App = () => {


  return (
    <div>
      <Routes>
        <Route path = "/" element = {<AuthPage />} />

        <Route path = "/home" element = {<h1>Hello</h1>} />
      </Routes>
    </div>
  )
}

export default App