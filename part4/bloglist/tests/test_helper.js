const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      "title": "How to Write a Killer Blog Post",
      "author": "Maliha",
      "url": "https://www.thesideblogger.com/how-to-write-a-blog-post/",
      "likes": 35
    },
    {
      "title": "The 18 Best Bars in Boston",
      "author": "Todd Plummer",
      "url": "https://www.cntraveler.com/gallery/best-bars-in-boston",
      "likes": 647
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ 
        title: 'willremovethissoon',
        author: 'john doe',
        url: 'http://fullstackopen.com',
        likes: '1' 
    })

    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}