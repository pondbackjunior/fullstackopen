import { createSlice } from "@reduxjs/toolkit"
import loginService from "../services/login"

const loginSlice = createSlice({
  name: "login",
  initialState: null,
  reducers: {
    login(state, action) {
      return action.payload
    },
  },
})

export const { login } = loginSlice.actions

export const handleLogin = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    dispatch(login(user))
    return user
  }
}

export default loginSlice.reducer
