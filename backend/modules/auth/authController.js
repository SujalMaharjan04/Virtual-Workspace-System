const authService = require('./auth.service')

const signUp = async(req, res) => {
    try {
        
        const {name, email, password, publicKey} = req.body

        if (!name || !email) {
            return res.status(400).json({message: "Name and email field can't be empty."})
        }

        if (!password || password.length < 6) {
            return res.status(400).json({message: "Password should be length of 6 or more"})
        }
        
        const {token, user} = await authService.signUpService({name, email, password, publicKey})

        res.status(201).json({token, user})


    } catch (error) {
        
        res.status(500).json({message: error.message})
    }
}

const login = async(req, res) => {
    try {
        const {form} = req.body
        const {email, password} = form
        const {publicKey} = req.body

        if (!email) {
            return res.status(400).json({message: "Email is required"})
        }

        if (!password || password.length < 6) {
            return res.status(400).json({message: "Password is required and should be of length 6 or greater"})
        }
        if (!publicKey) {
            return res.status(400).json({message: "Public Key should be present"})
        }

        const {token, user} = await authService.loginService({email, password, publicKey})

        res.status(201).json({token, user})
    } 
    catch (error) {
        console.log("Error in Login:" + error.message)
        res.status(500).json({message: error.message})
    }
}

const logout = async(req, res) => {
    try {
        const {userId} = req.user
        await authService.logoutService(userId)
        res.status(200).json({message: "logout successful"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: err.message})
    }
}


module.exports = {signUp, login, logout}