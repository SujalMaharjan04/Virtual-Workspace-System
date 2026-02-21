const prisma = require('../src/db')
const supertest = require("supertest")
const app = require('../src/app')
const {before, after, beforeEach, describe, test} = require('node:test')
const assert = require("node:assert")
const helper = require("./test_helper")
const api = supertest(app)

beforeEach(async() => {
    await prisma.room.deleteMany({})
    await prisma.user.deleteMany({})
})

after(async() => {
    await prisma.$disconnect()
})


describe("Testing for the rooms", () => {
    test('should create a room', async() => {
        const newUser = {
            name: "Bob",
            password: "123456",
            email: "bob@gmail.com"
        }

        await api.post('/api/auth/signup').send(newUser).expect(201).expect("Content-type", /application\/json/)
        const roomAtStart = await helper.roomInDb()
        const loginInfo = {
            email: "bob@gmail.com",
            password: "123456"
        }

        const response = await api.post("/api/auth/login").send(loginInfo).expect(201).expect("Content-type", /application\/json/)
        const newRoom = {
            name: "Bob's Room",
            password: "123456"
        }

        await api.post("/api/room/createroom").send(newRoom).set('Authorization', `Bearer ${response.body.token}`).expect(201).expect("Content-type", /application\/json/)

        const roomNow = await helper.roomInDb()
        assert.strictEqual(roomNow.length, roomAtStart.length + 1)
        
    })
})
