"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useWatchlist } from "@/contexts/watchlist-context"
import { fetchYieldData, formatAPY, formatTVL, getChainInfo, type YieldPool } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Loader2, Star } from "lucide-react"
import { Logo } from "@/components/logo"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function WatchlistPage() {
  const { user } = useAuth()
  const { watchlist, toggleWatchlist } = useWatchlist()
  const [isLoading, setIsLoading] = useState(true)
  const [watchlistItems, setWatchlistItems] = useState<YieldPool[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    }
  }, [user, router])

  useEffect(() => {
    const loadWatchlistData = async () => {
      if (watchlist.length === 0) {
        setWatchlistItems([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const allData = await fetchYieldData()
        const filteredData = allData.filter((item) => watchlist.includes(item.pool))
        setWatchlistItems(filteredData)
      } catch (error) {
        console.error("Error loading watchlist data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWatchlistData()
  }, [watchlist])

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] dark:bg-[#0f172a]">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-[#1e293b] shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Watchlist</CardTitle>
            <CardDescription>Track your favorite DeFi opportunities in one place</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading watchlist data...</span>
              </div>
            ) : watchlistItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
                <Button onClick={() => router.push("/")}>Browse Opportunities</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Chain</TableHead>
                    <TableHead>APY</TableHead>
                    <TableHead>TVL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchlistItems.map((item) => {
                    const chainInfo = getChainInfo(item.chain.toLowerCase())
                    return (
                      <TableRow key={item.pool}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleWatchlist(item.pool)}
                          >
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{item.symbol}</TableCell>
                        <TableCell>{item.project}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={chainInfo.logoURI}
                                alt={chainInfo.name}
                              />
                              <AvatarFallback className={`h-5 w-5 rounded-full ${chainInfo.color}`}>
                                {chainInfo.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{chainInfo.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">{formatAPY(item.apy)}</TableCell>
                        <TableCell>{formatTVL(item.tvlUsd)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
