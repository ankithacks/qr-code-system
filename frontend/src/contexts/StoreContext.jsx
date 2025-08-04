"use client"

import { createContext, useContext, useState } from "react"

const StoreContext = createContext()

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

export const StoreProvider = ({ children }) => {
  const [currentStore, setCurrentStore] = useState(null)
  const [stores] = useState([
    { id: "1", name: "Electronics Store", logo: "/placeholder.svg?height=50&width=50" },
    { id: "2", name: "Fashion Boutique", logo: "/placeholder.svg?height=50&width=50" },
    { id: "3", name: "Book Store", logo: "/placeholder.svg?height=50&width=50" },
  ])

  return (
    <StoreContext.Provider
      value={{
        currentStore,
        setCurrentStore,
        stores,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
