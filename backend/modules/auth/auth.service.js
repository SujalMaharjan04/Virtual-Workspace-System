const bcrypt = require('bcrypt')
const prisma = require('../../src/db')
const jwt = require('jsonwebtoken')
const config = require("../../utils/config")

const signUpService = async({name, email, password, publicKey}) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const existing = await prisma.user.findUnique({where: {email}})
        if (existing) {
            throw new Error('Email already exists')
        }

        const user = await prisma.user.create({
            data: {
                name, 
                email, 
                password: hashedPassword,
                public_key: publicKey
            }
        })

        return user

    } catch (error) {
        throw error
    }
}

const loginService = async({email, password}) => {
    try {
        const user = await prisma.user.findUnique({where: {email}})

        if (!user) throw new Error("Incorrect Credentials")

        const passwordCheck = await bcrypt.compare(password, user.password)

        if (!passwordCheck) throw new Error("Incorrect Password")
        
        const payload = {userId: user.user_id, email: user.email, userName: user.name}

        const token = jwt.sign(payload, config.SECRET, {expiresIn: "1d"})

        return token
    }
    catch (error) {
        throw error
    }
}

module.exports = {signUpService, loginService}