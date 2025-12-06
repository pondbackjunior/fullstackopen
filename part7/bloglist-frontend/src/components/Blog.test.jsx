import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"
import blogService from "../services/blogs"
import { vi } from "vitest"

vi.mock("../services/blogs")

const BLOG = {
  id: "123",
  title: "Component testing is done with react-testing-library",
  author: "Author Name",
  url: "http://example.com",
  likes: 5,
  user: { username: "testuser", name: "Test User", id: "456" },
}

test("renders content", () => {
  render(<Blog blog={BLOG} />)

  const blogTitle = screen.getByText(
    "Component testing is done with react-testing-library",
  )
  expect(blogTitle).toBeVisible()
  const blogAuthor = screen.getByText("Author Name")
  expect(blogAuthor).toBeVisible()
  const blogUrl = screen.getByText("http://example.com")
  expect(blogUrl).not.toBeVisible()
  const blogLikes = screen.getByText("likes 5")
  expect(blogLikes).not.toBeVisible()
})

test("shows url and likes when view button is clicked", async () => {
  render(<Blog blog={BLOG} />)
  const user = userEvent.setup()

  const button = screen.getByText("view")
  await user.click(button)

  const blogUrl = screen.getByText("http://example.com")
  expect(blogUrl).toBeVisible()
  const blogLikes = screen.getByText("likes 5")
  expect(blogLikes).toBeVisible()
})

test("calls event handler twice when like button is clicked twice", async () => {
  const mockHandler = vi.fn()
  blogService.update.mockResolvedValue({ ...BLOG, likes: 6 })
  blogService.getAll.mockResolvedValue([{ ...BLOG, likes: 6 }])

  render(<Blog blog={BLOG} setBlogs={mockHandler} />)
  const user = userEvent.setup()

  const viewButton = screen.getByText("view")
  await user.click(viewButton)

  const likeButton = screen.getByText("like")
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})
