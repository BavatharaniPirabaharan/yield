"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to validate credentials
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user exists in localStorage (our "database")
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        // Create a user object without the password
        const userToStore = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
        }

        // Store user in state and localStorage
        setUser(userToStore)
        localStorage.setItem("user", JSON.stringify(userToStore))
        return true
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      if (users.some((u: any) => u.email === email)) {
        return false
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password, // In a real app, this would be hashed
      }

      // Add to "database"
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Log user in
      const userToStore = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      }

      setUser(userToStore)
      localStorage.setItem("user", JSON.stringify(userToStore))

      return true
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
