const userController = require('./userController')
const userRouter = require('express').Router()
const {userExtractor} = require("../../utils/middleware")

///Route for getting public key
userRouter.get("/:userId/publicKey", userExtractor, userController.getPublicKey)

module.exports = userRouter