import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import BlogForm from "./components/BlogForm"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const showMessage = (message, type="info") => {
    setMessage({ text: message, type })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
      setUser(user)
      setUsername("")
      setPassword("")
    } catch {
      console.log("whoops")
      showMessage("wrong credentials", "error")
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            aria-label="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            aria-label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogsSection = () => (
    <>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} setBlogs={setBlogs} />
        )}
    </>
  )

  const logOutButton = () => (
    <button onClick={() => {
      window.localStorage.removeItem("loggedBlogappUser")
      setUser(null)
    }}>
      logout
    </button>
  )

  const createBlogSection = () => {
    return (
      <div>
        <BlogForm
          setBlogs={setBlogs}
          showMessage={showMessage}
        />
      </div>
    )
  }

  return (
    <div>
      {message && <div
        className={message.type}
        style={ { border: "solid", padding: 10, borderWidth: 1 } }
      >
        {message.text}
      </div>}
      <h2>Blogs</h2>
      {user && (
        <div>
          <p>{user.name} logged in</p> {logOutButton()}
          {createBlogSection()}
          <br/>
          <br/>
          {blogsSection()}
        </div>
      )}
      {!user && loginForm()}
    </div>
  )
}

export default App