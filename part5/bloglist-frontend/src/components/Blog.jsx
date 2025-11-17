import { useState } from "react"
import blogService from "../services/blogs"

const Blog = ({ blog, setBlogs }) => {
  const [blogDetailsVisible, setBlogDetailsVisible] = useState(false)

  const hideWhenVisible = { display: blogDetailsVisible ? "none" : "" }
  const showWhenVisible = { display: blogDetailsVisible ? "" : "none" }

  const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
  const loggedUser = loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  const canRemove = loggedUser && blog.user && (loggedUser.username === blog.user.username)
  const hideWhenRemoveButtonVisible = { display: canRemove ? "" : "none" }

  return (
    <div className="blog" style={ { border: "solid", padding: 10, borderWidth: 1 } }>
      <div className="blog-title">{blog.title}</div>
      <div className="blog-author">{blog.author}</div>
      <button style={hideWhenVisible} onClick={() => setBlogDetailsVisible(true)}>view</button>
      <div style={showWhenVisible} className="blog-details">
        <button onClick={() => setBlogDetailsVisible(false)}>hide</button>
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">likes {blog.likes} <button onClick={async () => {
          const updatedBlog = { ...blog, likes: blog.likes + 1 }
          await blogService.update(blog.id, updatedBlog)
          const updatedBlogs = await blogService.getAll()
          setBlogs(updatedBlogs)
        }}>like</button></div>
        <div style={hideWhenRemoveButtonVisible}>
          <button onClick={async () => {
            if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
              await blogService.del(blog.id)
              const updatedBlogs = await blogService.getAll()
              setBlogs(updatedBlogs)
            }
          }}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog