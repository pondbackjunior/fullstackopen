import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { content: "", type: null },
  reducers: {
    setNotification(state, action) {
      return action.payload
    }
  }
})

export const { setNotification } = notificationSlice.actions

export const showNotification = (content, type, timeout) => {
  return async (dispatch) => {
    dispatch(setNotification({ content, type }))
    setTimeout(() => {
      dispatch(setNotification({ content: "", type: null }))
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer