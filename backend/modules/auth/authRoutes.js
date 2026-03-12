const authController = require('./authController')
const authRouter = require('express').Router()

//Route for signUp
authRouter.post("/signup", authController.signUp)

//Route for login
authRouter.post("/login", authController.login)


module.exports = authRouter