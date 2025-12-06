import { createSlice } from "@reduxjs/toolkit"
import blogService from "../services/blogs"

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    likeBlog(state, action) {
      const id = action.payload
      return state.map((b) => (b.id !== id ? b : { ...b, likes: b.likes + 1 }))
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((b) => b.id !== id)
    },
  },
})

export const { addBlog, setBlogs, likeBlog, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const appendBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject)

    if (newBlog && newBlog.user && typeof newBlog.user === "string") {
      try {
        const logged = window.localStorage.getItem("loggedBlogappUser")
        const currentUser = logged ? JSON.parse(logged) : null
        if (currentUser) {
          newBlog.user = {
            username: currentUser.username,
            name: currentUser.name,
            id: currentUser.id,
          }
        }
      } catch (err) {}
    }

    dispatch(addBlog(newBlog))
  }
}

export const handleLikeBlog = (blogObject) => {
  return async (dispatch) => {
    const saved = await blogService.update(blogObject.id, blogObject)
    dispatch(likeBlog(saved.id))
  }
}

export const handleRemoveBlog = (id) => {
  return async (dispatch) => {
    const deletedBlog = await blogService.del(id)
    dispatch(deleteBlog(id))
  }
}

export const handleSetToken = (token) => {
  return async () => {
    blogService.setToken(token)
  }
}

export default blogSlice.reducer
