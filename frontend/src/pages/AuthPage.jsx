import SignUp from "../components/AuthPage/SignUp"
import Login from "../components/AuthPage/Login"
import { useState } from "react"


const AuthPage = () => {
    const [signUp, setSignUp] = useState(true)
    
    return (
        <div>
            {signUp ? <SignUp onSwitch = {() => setSignUp(false)} /> 
                    : <Login onSwitch = {() => setSignUp(true)} />}
        </div>
    )
}

export default AuthPage