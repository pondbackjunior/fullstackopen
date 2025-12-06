import { useState } from "react"
import { useDispatch } from "react-redux"
import { handleLikeBlog, handleRemoveBlog } from "../reducers/blogReducer"

import Button from "react-bootstrap/Button"

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)

  const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
  const loggedUser = loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  const canRemove =
    loggedUser && blog.user && loggedUser.username === blog.user.username

  return (
    <>
      <tr className="blog">
        <td className="blog-title">{blog.title}</td>
        <td className="blog-author">{blog.author}</td>
        <td>
          {!expanded && (
            <Button variant="info" onClick={() => setExpanded(true)}>
              view
            </Button>
          )}
          {expanded && (
            <Button variant="info" onClick={() => setExpanded(false)}>
              hide
            </Button>
          )}
        </td>
      </tr>

      {expanded && (
        <tr className="blog-details">
          <td colSpan="3">
            <div className="blog-url">{blog.url}</div>
            <div className="blog-likes">
              likes {blog.likes}{" "}
              <Button
                variant="primary"
                onClick={async () => {
                  const updatedBlog = { ...blog, likes: blog.likes + 1 }
                  dispatch(handleLikeBlog(updatedBlog))
                }}
              >
                like
              </Button>
            </div>
            <br />
            {canRemove && (
              <div className="blog-remove">
                <Button
                  variant="danger"
                  onClick={async () => {
                    if (
                      window.confirm(
                        `Remove blog ${blog.title} by ${blog.author}?`,
                      )
                    ) {
                      dispatch(handleRemoveBlog(blog.id))
                    }
                  }}
                >
                  remove
                </Button>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  )
}

export default Blog
