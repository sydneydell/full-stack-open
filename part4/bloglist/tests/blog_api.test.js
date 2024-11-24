const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
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
})

describe('viewing a specific blog post', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
    })

    test('succeeds with a valid id', async () => {
        const blogsAtStart = await Blog.find({})

        const blogToView = blogsAtStart[0]

        const resultBlog = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultBlog.body.title, blogToView.title)
    })

    test('fails with status code 404 if note does not exist', async () => {
        const validNonexistingID = await helper.nonExistingId()

        await api
          .get(`/api/blogs/${validNonexistingID}`)
          .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
        const invalidID =  '5a3d5da59070081a82a3445'

        await api
          .get(`/api/blogs/${invalidID}`)
          .expect(400)
    })
})

describe('addition of a new blog post', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
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
})

describe('deletion of a blog post', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
    })

    test('succeeds with a status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))
    })
})

describe('update blog post information', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('The title of an existing blog post can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const newBlog = {
      title: "A new title",
      author: blogToView.author,
      url: blogToView.url,
      likes: blogToView.likes
    }  

    await api    
      .put(`/api/blogs/${blogToView.id}`)  
      .send(newBlog)  
      .expect(200)    
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length, 'Expected blog to be updated')

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes("A new title"))  
  })

  test('The likes of an existing blog post can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const newBlog = {
      title: blogToView.title,
      author: blogToView.author,
      url: blogToView.url,
      likes: 24758
    }  

    await api    
      .put(`/api/blogs/${blogToView.id}`)  
      .send(newBlog)  
      .expect(200)    
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length, 'Expected blog to be updated')

    const likes = blogsAtEnd.map(b => b.likes)
    assert(likes.includes(24758))  
  })
})

after(async () => {
    await mongoose.connection.close()
})