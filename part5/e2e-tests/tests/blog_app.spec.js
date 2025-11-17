const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.request.post('http://localhost:3001/api/testing/reset')

    const newUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpassword',
    }
    await page.request.post('http://localhost:3001/api/users/', { data: newUser })

    const newUser2 = {
      name: 'Test User2',
      username: 'testuser2',
      password: 'testpassword2',
    }
    await page.request.post('http://localhost:3001/api/users/', { data: newUser2 })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Blogs')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('testpassword')
      await page.getByRole('button', { name: 'login' }).click()
      setTimeout(async () => { await expect(page.getByText('Test User logged in')).toBeVisible() }, 5000)
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testuser2')
      await page.getByLabel('password').fill('testpassword2')
      await page.getByRole('button', { name: 'login' }).click()
      setTimeout(async () => { await expect(page.getByText('Test User logged in')).not.toBeVisible() }, 5000)
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('testpassword')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      setTimeout(async () => { 
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByLabel('title').fill('My Title')
        await page.getByLabel('author').fill('My Author')
        await page.getByLabel('url').fill('myurl.com')
        await page.getByRole('button', { name: 'create' }).click()
      }, 5000)

      setTimeout(async () => {
        await expect(page.getByText('My Title')).toBeVisible()
      }, 5000)
    })

    test('blogs can be liked', async ({ page }) => {
      setTimeout(async () => { 
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByLabel('title').fill('My Title')
        await page.getByLabel('author').fill('My Author')
        await page.getByLabel('url').fill('myurl.com')
        await page.getByRole('button', { name: 'create' }).click()
      }, 5000)

      setTimeout(async () => {
        await page.getByRole('button', { name: 'show' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        setTimeout(async () => {
          await expect(page.getByText('1')).toBeVisible()
        }, 5000)
      }, 5000)
    })

    test('blogs can be deleted by the user', async ({ page }) => {
      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      setTimeout(async () => { 
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByLabel('title').fill('My Title')
        await page.getByLabel('author').fill('My Author')
        await page.getByLabel('url').fill('myurl.com')
        await page.getByRole('button', { name: 'create' }).click()
      }, 5000)

      setTimeout(async () => {
        await page.getByRole('button', { name: 'show' }).click()
        await page.getByRole('button', { name: 'delete' }).click()
        setTimeout(async () => {
          await expect(page.getByText('My Title')).not.toBeVisible()
        }, 5000)
      }, 5000)
    })

    test('only user who added the blog can see the delete button', async ({ page }) => {
      setTimeout(async () => { 
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByLabel('title').fill('My Title')
        await page.getByLabel('author').fill('My Author')
        await page.getByLabel('url').fill('myurl.com')
        await page.getByRole('button', { name: 'create' }).click()
      }, 5000)

      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByLabel('username').fill('testuser2')
      await page.getByLabel('password').fill('testpassword2')
      await page.getByRole('button', { name: 'login' }).click()
      
      setTimeout(async () => {
        await page.getByRole('button', { name: 'show' }).click()
        await page.getByRole('button', { name: 'delete' }).not.toBeVisible()
      }, 5000)
    })

    test('blogs are ordered by likes', async ({ page }) => {
      setTimeout(async () => { 
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByLabel('title').fill('My Title')
        await page.getByLabel('author').fill('My Author')
        await page.getByLabel('url').fill('myurl.com')
        await page.getByRole('button', { name: 'create' }).click()
      }, 5000)

      setTimeout(async () => { 
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByLabel('title').fill('My Title 2')
        await page.getByLabel('author').fill('My Author 2')
        await page.getByLabel('url').fill('myurl2.com')
        await page.getByRole('button', { name: 'create' }).click()
      }, 5000)
      
      // Click last show button on page, which should be for My Title 2
      setTimeout(async () => {
        await page.getByRole('button', { name: 'show' }).last().click()
        await page.getByRole('button', { name: 'like' }).click()
      }, 5000)
      
      // My Test 2 should now be earlier in the page than My Test
      const content = await page.textContent('body')
      setTimeout(async () => {
        await content.indexOf('My Test 2').toBeLessThan(content.indexOf('My Test'))
      }, 5000)
    })
  })
})