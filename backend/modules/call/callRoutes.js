const { roomExtractor } = require('../../utils/middleware')
const callController = require('./callController')
const callRouter = require("express").Router()

//Route to get the webrtc config
callRouter.get("/rtcconfig", roomExtractor, callController.getRTCConfiguration)

module.exports = callRouter