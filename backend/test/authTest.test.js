require('dotenv').config()
const supertest = require('supertest')
const prisma = require('../src/db')
const assert = require('node:assert')
const {beforeEach, after, describe, test} = require('node:test')
const app = require('../src/app')
const api = supertest(app)
const helper = require('./test_helper')

describe("Test for auth controller", () => {
    beforeEach(async() => {
        await prisma.user.deleteMany({})
    })

    after(async() => {
        await prisma.$disconnect()
    })

    test("signUp test", async() => {
        const usersAtStart = await helper.usersInDb()
        const userInfo = {
            name: "Ram",
            email: "ram@gmail.com",
            password: "123456"
        }

        await api
                .post("/api/auth/signup")
                .send(userInfo)
                .expect(201)
                .expect("Content-type", /application\/json/)

        const users = await helper.usersInDb()
        assert.strictEqual(users.length, usersAtStart.length + 1)

        const name = users.map(u => u.name)
        assert(name.includes(userInfo.name))
    })

    test("Login test", async () => {
        const userSignUp = {
            name: "Ram",
            email: "ram@gmail.com",
            password: "123456"
        }

        await api.post("/api/auth/signup").send(userSignUp).expect(201).expect("Content-type", /application\/json/)
        
        const user = {
            email: "ram@gmail.com",
            password: "123456"
        }

        const response = await api.post("/api/auth/login").send(user).expect(201).expect("Content-type", /application\/json/)
        assert(response.body.token)
    })
})

