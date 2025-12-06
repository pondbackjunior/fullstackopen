import { useState } from "react"
import { useDispatch } from 'react-redux'
import { appendBlog } from '../reducers/blogReducer'

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

const BlogForm = ({ setBlogs, showMessage }) => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [createBlogSectionVisible, setCreateBlogSectionVisible] =
    useState(false)

  const hideWhenVisible = { display: createBlogSectionVisible ? "none" : "" }
  const showWhenVisible = { display: createBlogSectionVisible ? "" : "none" }

  const createBlog = async () => {
    dispatch(appendBlog({ title: title, author: author, url: url }))
    setTitle("")
    setAuthor("")
    setUrl("")
    showMessage(`a new blog "${title}" by ${author} added`)
    setCreateBlogSectionVisible(false)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={() => setCreateBlogSectionVisible(true)}>
          new blog
        </Button>
      </div>
      <Form style={showWhenVisible}>
        <Button variant="warning" onClick={() => setCreateBlogSectionVisible(false)}>
          cancel
        </Button>
        <h2>Create new</h2>
        <Form.Group>
          title:
          <Form.Control
            aria-label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          author:
          <Form.Control
            aria-label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          url:
          <Form.Control
            aria-label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <br/>
        <Button
          variant="success"
          onClick={createBlog}
        >
          create
        </Button>
      </Form>
    </div>
  )
}

export default BlogForm
