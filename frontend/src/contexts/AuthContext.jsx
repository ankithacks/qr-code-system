"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { isAuthenticated, logout as apiLogout } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuth, setIsAuth] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsAuth(authenticated)

      // Get stored user data if available
      const storedUser = localStorage.getItem("user_data")
      if (storedUser && authenticated) {
        setUser(JSON.parse(storedUser))
      }

      // Get stored interaction count
      const storedCount = localStorage.getItem("interaction_count")
      if (storedCount) {
        setInteractionCount(Number.parseInt(storedCount, 10))
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setIsAuth(true)

    // Store user data in localStorage
    localStorage.setItem("user_data", JSON.stringify(userData))
    if (token) {
      localStorage.setItem("jwt_token", token)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuth(false)
    setInteractionCount(0)

    // Clear localStorage
    localStorage.removeItem("user_data")
    localStorage.removeItem("interaction_count")
    apiLogout()
  }

  const incrementInteraction = () => {
    const newCount = interactionCount + 1
    setInteractionCount(newCount)
    localStorage.setItem("interaction_count", newCount.toString())
  }

  const needsAuth = () => {
    return interactionCount >= 2 && !isAuth
  }

  const resetInteractionCount = () => {
    setInteractionCount(0)
    localStorage.removeItem("interaction_count")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: isAuth,
        interactionCount,
        loading,
        login,
        logout,
        incrementInteraction,
        needsAuth,
        resetInteractionCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
