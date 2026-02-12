require('dotenv').config()
const express = require('express')
const prisma = require("./db")

const app = express()
app.use(express.json())

app.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

app.post("/users", async(req, res) => {
    try {
        const {name, email, password} = req.body
        const user = await prisma.user.create({
            data: { name, email, password }
        })
        res.json(user)
    } catch (error) { 
        res.status(500).json({error: error.message})
    }
})

module.exports = app