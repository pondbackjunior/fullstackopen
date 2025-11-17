import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"
import blogService from "../services/blogs"
import { vi } from "vitest"

vi.mock("../services/blogs")

const BLOG = {
    id: "123",
    title: "Component testing is done with react-testing-library",
    author: "Author Name",
    url: "http://example.com",
    likes: 5,
    user: { username: "testuser", name: "Test User", id: "456" }
}

test("calls create blog handler with correct details when a new blog is created", async () => {
    const mockSetBlogs = vi.fn()
    const mockShowMessage = vi.fn()
    blogService.create.mockResolvedValue(BLOG)
    blogService.getAll.mockResolvedValue([BLOG])
    render(<BlogForm setBlogs={mockSetBlogs} showMessage={mockShowMessage} />)
    
    const user = userEvent.setup()
    const titleInput = screen.getByLabelText("title")
    const authorInput = screen.getByLabelText("author")
    const urlInput = screen.getByLabelText("url")
    const createButton = screen.getByText("create")

    await user.type(titleInput, "Component testing is done with react-testing-library")
    await user.type(authorInput, "Author Name")
    await user.type(urlInput, "http://example.com")
    await user.click(createButton)

    expect(blogService.create).toHaveBeenCalledWith({
        title: "Component testing is done with react-testing-library",
        author: "Author Name",
        url: "http://example.com"
    })
    expect(mockSetBlogs).toHaveBeenCalledTimes(1)
})