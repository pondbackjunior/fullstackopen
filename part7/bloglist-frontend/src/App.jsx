import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification } from "./reducers/notificationReducer"
import { initializeBlogs, handleSetToken } from "./reducers/blogReducer"

import Blog from "./components/Blog"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector((state) => state.blogs)
  const [user, setUser] = useState(null)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const showMessage = (message, type = "info") => {
    dispatch(showNotification(message, type, 5))
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      dispatch(handleSetToken(user.token))
    }
  }, [dispatch])

  const loginForm = () => {
    return (
      <div>
        <LoginForm setUser={setUser} showMessage={showMessage} />
      </div>
    )
  }

  const blogsSection = () => {
    const sorted = (blogs || []).slice().sort((a, b) => b.likes - a.likes)
    return (
      <>
        <Table striped>
          <tbody>
            {sorted.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </tbody>
        </Table>
      </>
    )
  }

  const logOutButton = () => (
    <Button
      variant="danger"
      onClick={() => {
        window.localStorage.removeItem("loggedBlogappUser")
        setUser(null)
      }}
    >
      logout
    </Button>
  )

  const createBlogSection = () => {
    return (
      <div>
        <BlogForm showMessage={showMessage} />
      </div>
    )
  }

  return (
    <div className="container">
      <Notification />
      <h2>Blogs</h2>
      {user && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <p>{user.name} logged in</p> {logOutButton()}
          </div>
          <br />
          <br />
          {createBlogSection()}
          <br />
          <br />
          {blogsSection()}
        </div>
      )}
      {!user && loginForm()}
    </div>
  )
}

export default App
