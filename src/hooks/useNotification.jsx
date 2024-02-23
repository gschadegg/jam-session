import React, { useContext, useState } from 'react'

const NotificationContext = React.createContext()

// manages & makes available Notifications state
export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState('info') // error, success, info, or warning
  const [showNotification, setShowNotification] = useState(false)

  // set and trigger notification to display
  const setNotification = (message, status) => {
    setMessage(message)
    setStatus(status)
    setShowNotification(true)

    setTimeout(() => {
      setShowNotification(false)
    }, 8000)
  }

  // Notification component
  const Notification = () => {
    const classes = `alert alert-${status} absolute left-[8.33%] w-10/12 z-50 top-[12px] opacity-100 `
    return showNotification ? (
      <div role="alert" className={classes}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>{message}</span>
      </div>
    ) : (
      ''
    )
  }

  return (
    <NotificationContext.Provider
      value={{
        message,
        status,
        setNotification,
        Notification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const { message, status, setNotification, Notification } =
    useContext(NotificationContext)
  return { message, status, setNotification, Notification }
}
