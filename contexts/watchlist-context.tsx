"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

interface WatchlistContextType {
  watchlist: string[] // Array of pool IDs
  isInWatchlist: (poolId: string) => boolean
  addToWatchlist: (poolId: string) => void
  removeFromWatchlist: (poolId: string) => void
  toggleWatchlist: (poolId: string) => void
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<string[]>([])

  // Load watchlist from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedWatchlist = localStorage.getItem(`watchlist-${user.id}`)
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist))
      } else {
        setWatchlist([])
      }
    } else {
      setWatchlist([])
    }
  }, [user])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`watchlist-${user.id}`, JSON.stringify(watchlist))
    }
  }, [watchlist, user])

  const isInWatchlist = (poolId: string) => {
    return watchlist.includes(poolId)
  }

  const addToWatchlist = (poolId: string) => {
    if (!isInWatchlist(poolId)) {
      setWatchlist([...watchlist, poolId])
    }
  }

  const removeFromWatchlist = (poolId: string) => {
    setWatchlist(watchlist.filter((id) => id !== poolId))
  }

  const toggleWatchlist = (poolId: string) => {
    if (isInWatchlist(poolId)) {
      removeFromWatchlist(poolId)
    } else {
      addToWatchlist(poolId)
    }
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isInWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider")
  }
  return context
}
