const express = require('express')
const mongoose = require('mongoose')
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')
const blogsRouter = require('./src/controllers/blogs')
const usersRouter = require('./src/controllers/users')
const loginRouter = require('./src/controllers/login')
const testingRouter = require('./src/controllers/testing')
const middleware = require('./src/utils/middleware')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.getTokenFrom)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/testing', testingRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app