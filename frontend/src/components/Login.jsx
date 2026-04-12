import { useState } from "react"



const LogIn = ({onSwitch}) => {
    const [form, setForm] = useState({
        "email": "",
        "password": ""
    })
    const [error, setError] = useState({})

    const validateEmail = (value) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(value)
    }

    const handleInput = (e) => {
        const {name, value} = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))

        if (name === "email") {
            setError((prev) => ({
                ...prev,
                email: validateEmail(value) ? "" : "Enter a Valid Email"
            }))
        }
    } 

    const handleSubmit = (e) => {
        e.preventDefault()
        
        const newError = {}

        if (!validateEmail(form.email)) {
            newError.email = "Enter a valid Email"
        }

        if (!form.password) {
            newError.password = "Enter a password"
        }

        setError(newError)

        if (Object.keys(error).length === 0) {
            console.log("Login Submitted")
        }
    }

    return (
        <div className = "bg-[#0F1117] text-[#F1F5F9] h-screen flex flex-col items-center justify-center">
            <div>
                <h1 className = "text-5xl font-bold mb-6">Login</h1>
            </div>

            <div>
                <form onSubmit = {handleSubmit} className = "flex flex-col justify-center items-center gap-10 text-2xl">
                    <div className = "inputDivStyle">
                        <label htmlFor = "email">Email</label>
                        <input onChange = {handleInput} type = "email" name = "email" className = "inputStyle" placeholder="Enter Your Email" value = {form.email} />
                    </div>

                    <div className = "inputDivStyle">
                        <label htmlFor = "password">Password</label>
                        <input onChange = {handleInput} type = "password" name = "password" className = "inputStyle" placeholder = "Enter Your Password" value = {form.password} />
                    </div>

                    <div className = "w-full flex justify-center items-center">
                        <button type = "submit" className = "submitBtn">Login</button>
                    </div>
                </form>


                <div className = "flex justify-center items-center mt-6">
                    <p className = "underline text-2xl hover:cursor-pointer" onClick = {onSwitch}>Sign Up</p>
                </div>
            </div>
        </div>
    )
}

export default LogIn