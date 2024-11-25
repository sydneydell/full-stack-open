const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
    beforeEach(async() => {
        await User.deleteMany({})

        const passwordHash = await bcryptjs.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with status code 400 and message if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

describe('invalid user information', () => {
    test('Raise an error if username is less than 3 characters', async () => {
        const newUser = {
            username: 'N',
            name: 'Star',
            password: 'Rooster'
        }
        
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Username must be at least 3 characters'))
    })

    test('Raise an error if password is less than 3 characters', async () => {
        const newUser = {
            username: 'Newguy',
            name: 'Star',
            password: 'R'
        }
        
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Password must be at least 3 characters'))
    })

    test('Raise an error if username or password are missing', async () => {
        const noUsername = {
            username: '',
            name: 'Star',
            password: 'Rooster'
        }
        
        const result1 = await api
            .post('/api/users')
            .send(noUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const noPassword = {
            username: '',
            name: 'Star',
            password: 'Rooster'
        }
        
        const result2 = await api
            .post('/api/users')
            .send(noPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

    })
})

after(async () => {
    await mongoose.connection.close()
})