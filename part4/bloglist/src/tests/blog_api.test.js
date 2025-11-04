const { test, after, beforeEach } = require('node:test')
const assert = require('assert').strict
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app.js')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

let token = null

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const testUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpass123'
  }

  await api
    .post('/api/users')
    .send(testUser)

  
  const response = await api
    .post('/api/login')
    .send({
      username: testUser.username,
      password: testUser.password
    })

  token = response.body.token
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('unique identifier of blogs is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    assert.ok(blog.id, 'blog id is not defined')
  })
})

test('can successfully add a new blog', async () => {
  const newBlog = {
    title: 'testblog',
    author: 'Hermanni',
    url: 'google.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'myblog',
    author: 'Hermanni',
    url: 'google.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert.equal(response.body.likes, 0)
})

test('blog without title and url is not added', async () => {
  const newBlog = {
    author: 'Hermanni',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog can be deleted', async () => {
  const newBlog = {
    title: 'myblog',
    author: 'Hermanni',
    url: 'google.com',
    likes: 2
  }

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogId = postResponse.body.id

  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const getResponse = await api.get('/api/blogs')
  const blogs = getResponse.body

  assert.ok(!blogs.find(blog => blog.id === blogId), 'blog was not deleted')
})

test('blog likes can be updated', async () => {
  const newBlog = {
    title: 'myblog',
    author: 'Hermanni',
    url: 'google.com',
    likes: 3
  }

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogId = postResponse.body.id
  const updatedLikes = 10

  const putResponse = await api
    .put(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ likes: updatedLikes })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.equal(putResponse.body.likes, updatedLikes)
})

test('adding blog fails with status 401 if token is not provided', async () => {
  const newBlog = {
    title: 'myblog',
    author: 'Hermanni',
    url: 'google.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})