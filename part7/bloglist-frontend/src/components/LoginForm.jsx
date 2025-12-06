import { useState } from "react"
import { handleLogin } from "../reducers/loginReducer"
import { useDispatch } from "react-redux"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

const LoginForm = ({ setUser, showMessage }) => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const performLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await dispatch(handleLogin({ username, password }))
      if (!user) throw new Error("login returned no user")
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
      setUser(user)
      setUsername("")
      setPassword("")
      showMessage(`Welcome, ${user.username}!`)
    } catch {
      showMessage("wrong credentials", "danger")
    }
  }

  return (
    <Form onSubmit={performLogin}>
      <Form.Group>
        <Form.Label>
          username
          <Form.Control
            aria-label="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Label>
      </Form.Group>
      <Form.Group>
        <Form.Label>
          password
          <Form.Control
            aria-label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Label>
      </Form.Group>
      <Button variant="primary" type="submit">
        login
      </Button>
    </Form>
  )
}

export default LoginForm
