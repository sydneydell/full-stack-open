const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Get all the blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

// Helper function to extract the token
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}

// Post a new blog (restricted to logged-in users)
blogsRouter.post('/', async (request, response) => {
    const body = request.body
    
    if (body.title === undefined || body.url === undefined) {
        return response.status(400).end()
    }

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(404).json({ error: 'User not found' });
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

// Identify each resource with a unique URL following RESTful convention
blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

// Update the information for a specific blog post
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    }

    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(blog)
})

module.exports = blogsRouter
