import { createContext, useReducer, useContext, useRef } from "react"

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload
    case "CLEAR":
      return null
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  const notify = (text) => {
    notificationDispatch({ type: "SET", payload: { text } })
    setTimeout(() => {
      notificationDispatch({ type: "CLEAR" })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("error")
  }
  return context
}

const Notification = () => {
  const { notification } = useNotification()

  if (!notification) return null

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={style}>
      {notification.text}
    </div>
  )
}

export default Notification
