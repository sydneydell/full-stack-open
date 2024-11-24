const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
})

test('Blog info is returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('There are two blog posts saved', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
})

test('The unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    assert.ok(blogs[0].id, 'Expected property "id" to be defined')
    assert.strictEqual(blogs[0]._id, undefined, 'Property "_id" should not exist')
})

test('A valid blog post can be added', async () => {
    const newBlog = {
      "title": "A new blog",
      "author": "John Smith",
      "url": "https://www.traveler.com/gallery/",
      "likes": 13
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1, 'Expected blog to be added')

    const titles = blogsAtEnd.map(n => n.title)
    assert(titles.includes("A new blog"))
})

test('Likes property defaults to 0 if it is missing', async () => {
    const newBlog = {
      "title": "A new blog",
      "author": "John Smith",
      "url": "https://www.traveler.com/gallery/"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = await blogsAtEnd.find(blog => blog.title === "A new blog")
    assert.strictEqual(addedBlog.likes, 0)
})

test('Blog without title is not added', async () => {
    const newBlog1 = {
      "author": "John Smith",
      "url": "https://www.traveler.com/gallery/",
      "like": 13
    }

    await api
      .post('/api/blogs')
      .send(newBlog1)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('Blog without url is not added', async () => {
    const newBlog2 = {
      "title": "A new blog",
      "author": "John Smith",
      "like": 13
    }

    await api
      .post('/api/blogs')
      .send(newBlog2)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})



// verify that if title or url properties are missing from request data, backend respoonds with 400 Bad request