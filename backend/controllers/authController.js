const authService = require('../services/authService')

const signUp = async(req, res) => {
    try {
        const {name, email, password} = req.body

        if (!name || !email) {
            return res.status(400).json({message: "Name and email field can't be empty."})
        }

        if (!password || password.length < 6) {
            return res.status(400).json({message: "Password should be length of 6 or more"})
        }

        const user = await authService.signUpService({name, email, password})

        res.status(201).json(user)


    } catch (error) {
        console.log("Error In SignUp:" + error.message)
        res.status(500).json({message: error.message})
    }
}

const login = async(req, res) => {
    try {
        const {email, password} = req.body

        if (!email) {
            return res.status(400).json({message: "Email is required"})
        }

        if (!password || password.length < 6) {
            return res.status(400).json({message: "Password is required and should be of length 6 or greater"})
        }

        const userLogged = await authService.loginService({email, password})

        res.status(201).json({token: userLogged})
    } 
    catch (error) {
        console.log("Error in Login:" + error.message)
        res.status(500).json({message: error.message})
    }
}


module.exports = {signUp, login}