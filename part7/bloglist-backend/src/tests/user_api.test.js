const { test, after } = require('node:test')
const assert = require('assert').strict
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app.js')

const api = supertest(app)

test('invalid user is not created and proper status code is returned', async () => {
  const newUser = {
    name: 'Invalid User'
  }

  const response = await api.post('/api/users/').send(newUser)
  assert.equal(response.status, 400)
})

test('error message is returned when creating invalid user', async () => {
  const newUser = {
    name: 'Invalid User'
  }

  const response = await api.post('/api/users/').send(newUser)
  assert.equal(response.body.error, 'missing fields')
})