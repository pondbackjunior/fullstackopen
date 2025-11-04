const mongoose = require('mongoose')
const Blog = require('./models/blog')

const title = process.argv[2]
const author = process.argv[3]
const url = process.argv[4]
const likes = process.argv[5]

if (title && author && url) {
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  })

  blog.save().then(() => {
    console.log(`added ${title} to bloglist`)
    mongoose.connection.close()
  })
} else {
  Blog.find({}).then(result => {
    result.forEach(blog => {
      console.log(blog)
    })
    mongoose.connection.close()
  })
}