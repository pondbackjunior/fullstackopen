import { useState } from "react"
import blogService from "../services/blogs"

const BlogForm = (
  { setBlogs, showMessage }
) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [createBlogSectionVisible, setCreateBlogSectionVisible] = useState(false)

  const hideWhenVisible = { display: createBlogSectionVisible ? "none" : "" }
  const showWhenVisible = { display: createBlogSectionVisible ? "" : "none" }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setCreateBlogSectionVisible(true)}>new blog</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={() => setCreateBlogSectionVisible(false)}>cancel</button>
        <h2>Create new</h2>
        <div>
            title:
          <input
            aria-label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
            author:
          <input
            aria-label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
            url:
          <input
            aria-label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button onClick={async () => {
          await blogService.create({ title, author, url })
          setTitle("")
          setAuthor("")
          setUrl("")
          const updatedBlogs = await blogService.getAll()
          setBlogs(updatedBlogs)
          showMessage(`a new blog "${title}" by ${author} added`)
          setCreateBlogSectionVisible(false)
        }}>create</button>
      </div>
    </div>
  )
}

export default BlogForm