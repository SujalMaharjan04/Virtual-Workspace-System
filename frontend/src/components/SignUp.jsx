
import { useState } from 'react';
import authService from '../services/authService'
import { generateKeyPair } from '../utils/crypto';
import useAuthStore from '../store/authStore'

const SignUp = ({onSwitch}) => {

    const setUser = useAuthStore((state) => state.setUser)
    const setToken = useAuthStore((state) => state.setToken)

    const [form, setForm] = useState({
        "name": "",
        "email": "",
        "password": "",
        "publicKey": ""
    })
    const [errors, setErrors] = useState({})

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
            setErrors((prev) => ({
                ...prev,
                email: validateEmail(value) ? "" : "Enter a Valid Email"
            }))
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        const newErrors = {}

        if (!form.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!validateEmail(form.email)) {
            newErrors.email = "Enter a valid email"
        }

        if (form.password.length < 6) {
            newErrors.password = "Password should be of length greater than 6"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            const {publicKey, privateKey} = await generateKeyPair()

            localStorage.setItem("privateKey", privateKey)

            if (!publicKey) return 
            
            setForm((prev) => ({
                ...prev,
                publicKey
            }))

            const response = await authService.signUp(form)
            
            if (response.result) {
                setUser(response.data.user)
                setToken(response.data.token)
            } else {
                console.log(response.data)
            }
        }

        setForm({
            "name": "",
            "email": "",
            "password": "",
            "publicKey": ""
        })
    }

    return (
        <div className = "bg-[#0F1117] text-[#F1F5F9] h-screen flex flex-col items-center justify-center">
            <div>
                <h1 className = "text-5xl  font-bold mb-6">Sign Up</h1>
            </div>

            <div>
                <form className = "flex flex-col justify-center items-center gap-10 text-2xl" onSubmit = {handleSubmit}>
                    <div className = "inputDivStyle">
                        <label htmlFor = "name">Name</label>
                        <input onChange = {handleInput} type = "text" name = "name" className = "inputStyle" placeholder = "Enter Your Name" value = {form.name} />
                        {errors.name && (
                            <p className = "error">{errors.name}</p>
                        )}
                    </div>

                    <div className = "inputDivStyle">
                        <label htmlFor = "email">Email</label>
                        <input onChange = {handleInput} type = "email" name = "email" className = "inputStyle" placeholder = "Enter Your Email" value = {form.email} />
                        {errors.email && (
                            <p className = "error">{errors.email}</p>
                        )}
                    </div>

                    <div className = "inputDivStyle">
                        <label htmlFor = "password">Password</label>
                        <input onChange = {handleInput} type = "password" name = "password" className = "inputStyle" placeholder = "Enter Your Password" value = {form.password} />
                        {errors.password && (
                            <p className = "error">{errors.password}</p>
                        )}
                    </div>

                    <div className = "w-full flex justify-center items-center">
                        <button type = "submit" className = "submitBtn">Signup</button>
                    </div>
                </form>


                <div className = "flex justify-center items-center mt-6">
                    <p className = "underline font-4xl hover:cursor-pointer" onClick = {onSwitch}>Log In</p>
                </div>
            </div>
        </div>
    )
}


export default SignUp;