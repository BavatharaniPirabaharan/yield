"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowUpDown,
  DollarSign,
  ChevronDown,
  Menu,
  TrendingUp,
  Wallet,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Star,
  StarOff,
  Info,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Percent,
  Bookmark,
  ChevronUp,
  Download,
  Layers,
  LogIn,
  UserPlus,
  Loader2,
  Shield,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { StatsCard } from "@/components/stats-card"
import { MobileDataCard } from "@/components/mobile-data-card-new"
import { useState, useEffect } from "react"
import { fetchYieldData, formatAPY, formatTVL, getChainInfo, type YieldPool } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useWatchlist } from "@/contexts/watchlist-context"
import { UserMenu } from "@/components/user-menu"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function Home() {
  const { user } = useAuth()
  const { watchlist, isInWatchlist, toggleWatchlist } = useWatchlist()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [yieldData, setYieldData] = useState<YieldPool[]>([])
  const [sortColumn, setSortColumn] = useState("apy")
  const [sortDirection, setSortDirection] = useState("desc")
  const [platformFilters, setPlatformFilters] = useState<string[]>([])
  const [chainFilters, setChainFilters] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<YieldPool[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Get unique platforms for filter
  const platforms = Array.from(new Set(yieldData.map((item) => item.project)))
  const uniqueChains = Array.from(new Set(yieldData.map((item) => item.chain.toLowerCase())))

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchYieldData()
        setYieldData(data)
        setFilteredData(data)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [sortColumn, sortDirection, platformFilters, chainFilters, searchTerm, yieldData])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const togglePlatformFilter = (platform: string) => {
    setPlatformFilters((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const toggleChainFilter = (chain: string) => {
    setChainFilters((prev) => (prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]))
  }

  const applyFilters = () => {
    let result = [...yieldData]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.project.toLowerCase().includes(term) ||
          item.symbol.toLowerCase().includes(term) ||
          item.chain.toLowerCase().includes(term),
      )
    }

    // Apply platform filters
    if (platformFilters.length > 0) {
      result = result.filter((item) => platformFilters.includes(item.project))
    }

    // Apply chain filters
    if (chainFilters.length > 0) {
      result = result.filter((item) => chainFilters.includes(item.chain.toLowerCase()))
    }

    // Sort the filtered data with null checks
    result.sort((a, b) => {
      const aValue = a[sortColumn as keyof YieldPool]
      const bValue = b[sortColumn as keyof YieldPool]

      // Handle null or undefined values
      if (aValue === null || aValue === undefined) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (bValue === null || bValue === undefined) {
        return sortDirection === "asc" ? 1 : -1
      }

      // Handle numeric values
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      // Handle string values
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    setFilteredData(result)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Calculate stats
  const totalTVL = yieldData.reduce((sum, item) => sum + (item.tvlUsd || 0), 0)
  const validApyValues = yieldData.filter((item) => item.apy !== null && item.apy !== undefined)
  const averageAPY =
    validApyValues.length > 0
      ? validApyValues.reduce((sum, item) => sum + (item.apy || 0), 0) / validApyValues.length
      : 0
  const topAPY = validApyValues.length > 0 ? Math.max(...validApyValues.map((item) => item.apy || 0)) : 0
  const topAPYPool = yieldData.find((item) => item.apy === topAPY)

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const exportToCSV = () => {
    const headers = ["Project", "Chain", "Symbol", "APY", "TVL", "Pool"]
    const csvData = filteredData.map((item) => [
      item.project,
      item.chain,
      item.symbol,
      item.apy.toString(),
      item.tvlUsd.toString(),
      item.pool,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "defi_yields.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleWatchlistToggle = (poolId: string) => {
    if (!user) {
      // Redirect to sign in if not logged in
      router.push("/signin")
    } else {
      toggleWatchlist(poolId)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] dark:bg-[#0f172a]">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-[#1e293b] shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                  <SheetDescription>Navigate DeFi yield opportunities</SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <div className="mb-4">
                    <Input
                      placeholder="Search protocols, assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="dashboard">
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>Dashboard</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-1 pl-6">
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Overview
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Analytics
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start h-8 px-2"
                            onClick={() => (user ? router.push("/watchlist") : router.push("/signin"))}
                          >
                            Watchlist
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="networks">
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          <span>Networks</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-1 pl-6">
                          {uniqueChains.slice(0, 8).map((chain) => (
                            <Button
                              key={chain}
                              variant="ghost"
                              className="justify-start h-8 px-2"
                              onClick={() => toggleChainFilter(chain)}
                            >
                              {getChainInfo(chain).name}
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="protocols">
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Protocols</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-1 pl-6 max-h-[200px] overflow-y-auto">
                          {platforms.slice(0, 10).map((platform) => (
                            <Button
                              key={platform}
                              variant="ghost"
                              className="justify-start h-8 px-2"
                              onClick={() => togglePlatformFilter(platform)}
                            >
                              {platform}
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  {!user ? (
                    <>
                      <Button className="w-full" variant="outline" onClick={() => router.push("/signin")}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                      <Button className="w-full" onClick={() => router.push("/signup")}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full" onClick={() => router.push("/watchlist")}>
                      <Star className="h-4 w-4 mr-2" />
                      View Watchlist
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden md:flex">
              <UserMenu />
            </div>
            <Button
              className="md:hidden"
              size="icon"
              variant="outline"
              onClick={() => router.push(user ? "/watchlist" : "/signin")}
            >
              {user ? <Star className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="hidden md:block w-[240px] shrink-0">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Asset Type</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={searchTerm.includes("USD") ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSearchTerm(searchTerm.includes("USD") ? "" : "USD")}
                        >
                          Stablecoins
                        </Badge>
                        <Badge
                          variant={searchTerm === "ETH" ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSearchTerm(searchTerm === "ETH" ? "" : "ETH")}
                        >
                          ETH
                        </Badge>
                        <Badge
                          variant={searchTerm === "BTC" ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSearchTerm(searchTerm === "BTC" ? "" : "BTC")}
                        >
                          BTC
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Network</div>
                      <div className="flex flex-col space-y-2 max-h-[150px] overflow-y-auto">
                        {uniqueChains.slice(0, 10).map((chain) => {
                          const chainInfo = getChainInfo(chain)
                          return (
                            <div key={chain} className="flex items-center space-x-2">
                              <Checkbox
                                id={`chain-${chain}`}
                                checked={chainFilters.includes(chain)}
                                onCheckedChange={() => toggleChainFilter(chain)}
                              />
                              <label
                                htmlFor={`chain-${chain}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                              >
                                <Avatar className="h-4 w-4">
                                  <AvatarImage
                                    src={chainInfo.logoURI || `/placeholder.svg?height=16&width=16`}
                                  />
                                  <AvatarFallback className={`h-4 w-4 rounded-full ${chainInfo.color}`}></AvatarFallback>
                                </Avatar>
                                {chainInfo.name}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Platforms</div>
                      <div className="flex flex-col space-y-2 max-h-[150px] overflow-y-auto pr-2">
                        {platforms.slice(0, 15).map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                              id={`platform-${platform}`}
                              checked={platformFilters.includes(platform)}
                              onCheckedChange={() => togglePlatformFilter(platform)}
                            />
                            <label
                              htmlFor={`platform-${platform}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {platform}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{user ? "Your Watchlist" : "Top Protocols"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {user && watchlist.length > 0 ? (
                      // Show user's watchlist
                      <>
                        {yieldData
                          .filter((item) => watchlist.includes(item.pool))
                          .slice(0, 3)
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{item.project}</div>
                                  <div className="text-xs text-muted-foreground">{formatAPY(item.apy)}</div>
                                </div>
                              </div>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </div>
                          ))}
                        <Separator />
                        <div className="text-center">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-xs"
                            onClick={() => router.push("/watchlist")}
                          >
                            View All Watchlist Items
                          </Button>
                        </div>
                      </>
                    ) : (
                      // Show top protocols for non-logged in users or empty watchlist
                      <>
                        {yieldData.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <DollarSign className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{item.project}</div>
                                <div className="text-xs text-muted-foreground">{formatAPY(item.apy)}</div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleWatchlistToggle(item.pool)}
                            >
                              <StarOff className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
                            </Button>
                          </div>
                        ))}
                        <Separator />
                        <div className="text-center">
                          {!user ? (
                            <Button variant="link" size="sm" className="text-xs" onClick={() => router.push("/signin")}>
                              <LogIn className="h-3 w-3 mr-1" />
                              Sign in to save your watchlist
                            </Button>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Add items to your watchlist by clicking the star icon
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">DeFi Yield Tracker</h1>
                <p className="text-muted-foreground">
                  Track the base performance of DeFi products with transparent, data-driven insights
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatsCard
                  title="Top APY"
                  value={formatAPY(topAPY)}
                  description={topAPYPool ? `${topAPYPool.project} - ${topAPYPool.symbol}` : "Loading..."}
                  icon={TrendingUp}
                  trend="up"
                  trendValue="+1.2%"
                />
                <StatsCard
                  title="Total Value Locked"
                  value={formatTVL(totalTVL)}
                  description="Across all tracked protocols"
                  icon={Wallet}
                  trend="up"
                  trendValue="+$12.4M"
                />
                <StatsCard
                  title="Average APY"
                  value={formatAPY(averageAPY)}
                  description="Average across all pools"
                  icon={Percent}
                  trend="neutral"
                  trendValue="0.0%"
                />
              </div>

              <Card className="mb-6">
                <CardHeader className="pb-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Yield Opportunities</CardTitle>
                      <CardDescription>
                        {isLoading
                          ? "Loading yield data..."
                          : error
                            ? "Error loading data"
                            : `Showing ${filteredData.length.toLocaleString()} opportunities`}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <Sliders className="h-3.5 w-3.5 mr-2" />
                            Filters
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <div className="p-2">
                            <div className="mb-2 text-sm font-medium">Asset Type</div>
                            <div className="flex flex-wrap gap-1 mb-4">
                              <Badge
                                variant={searchTerm === "" ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSearchTerm("")}
                              >
                                All
                              </Badge>
                              <Badge
                                variant={searchTerm.includes("USD") ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSearchTerm(searchTerm.includes("USD") ? "" : "USD")}
                              >
                                Stablecoins
                              </Badge>
                              <Badge
                                variant={searchTerm === "ETH" ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSearchTerm(searchTerm === "ETH" ? "" : "ETH")}
                              >
                                ETH
                              </Badge>
                            </div>
                            <Button size="sm" className="w-full" onClick={applyFilters}>
                              Apply
                            </Button>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                            Sort
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSortColumn("apy")
                              setSortDirection("desc")
                            }}
                          >
                            APY (High to Low)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSortColumn("apy")
                              setSortDirection("asc")
                            }}
                          >
                            APY (Low to High)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSortColumn("tvlUsd")
                              setSortDirection("desc")
                            }}
                          >
                            TVL (High to Low)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSortColumn("project")
                              setSortDirection("asc")
                            }}
                          >
                            Project (A-Z)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="outline" size="sm" className="h-8" onClick={exportToCSV}>
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Loading yield data...</span>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center py-20 text-destructive">
                      <AlertTriangle className="h-8 w-8 mr-2" />
                      <span>{error}</span>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead>Asset</TableHead>
                              <TableHead>Platform</TableHead>
                              <TableHead>Chain</TableHead>
                              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("apyBase")}>
                                <div className="flex items-center justify-end gap-1">
                                  <span>Base APY</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Base APY from the protocol</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  {sortColumn === "apyBase" && (
                                    sortDirection === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("apyReward")}>
                                <div className="flex items-center justify-end gap-1">
                                  <span>Reward APY</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Additional APY from reward tokens</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  {sortColumn === "apyReward" && (
                                    sortDirection === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("apy")}>
                                <div className="flex items-center justify-end gap-1">
                                  <span>APY</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Total APY (Base + Reward)</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  {sortColumn === "apy" && (
                                    sortDirection === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("apyPct7D")}>
                                <div className="flex items-center justify-end gap-1">
                                  <span>7D APY</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>7-day average APY</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  {sortColumn === "apyPct7D" && (
                                    sortDirection === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("apyMean30d")}>
                                <div className="flex items-center justify-end gap-1">
                                  <span>30D APY</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>30-day average APY</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  {sortColumn === "apyMean30d" && (
                                    sortDirection === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("tvlUsd")}>
                                <div className="flex items-center gap-1">
                                  TVL
                                  {sortColumn === "tvlUsd" &&
                                    (sortDirection === "asc" ? (
                                      <ChevronUp className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    ))}
                                </div>
                              </TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentItems.map((item, index) => {
                              const chainInfo = getChainInfo(item.chain.toLowerCase())
                              const inWatchlist = user && isInWatchlist(item.pool)

                              return (
                                <TableRow key={index} className="hover:bg-muted/50">
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleWatchlistToggle(item.pool)}
                                      title={
                                        user
                                          ? inWatchlist
                                            ? "Remove from watchlist"
                                            : "Add to watchlist"
                                          : "Sign in to add to watchlist"
                                      }
                                    >
                                      {inWatchlist ? (
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                      ) : (
                                        <StarOff className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
                                      )}
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                      </div>
                                      <span className="font-medium">{item.symbol}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <HoverCard>
                                      <HoverCardTrigger asChild>
                                        <div className="cursor-help flex items-center gap-1">
                                          <div className="font-medium">{item.project}</div>
                                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                      </HoverCardTrigger>
                                      <HoverCardContent className="w-80">
                                        <div className="flex justify-between space-x-4">
                                          <Avatar>
                                            <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                                            <AvatarFallback>{item.project.substring(0, 2)}</AvatarFallback>
                                          </Avatar>
                                          <div className="space-y-1">
                                            <h4 className="text-sm font-semibold">{item.project}</h4>
                                            <p className="text-sm">{item.poolMeta || item.symbol}</p>
                                            <div className="flex items-center pt-2">
                                              <Badge variant="outline" className="text-xs">
                                                {item.ilRisk ? `Risk: ${item.ilRisk}` : "Risk: Medium"}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      </HoverCardContent>
                                    </HoverCard>
                                    <div className="text-xs text-muted-foreground">{item.poolMeta || "Lending"}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`h-6 w-6 rounded-full ${chainInfo.color} flex items-center justify-center`}
                                      >
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={chainInfo.logoURI || `/placeholder.svg?height=24&width=24`}
                                          />
                                          <AvatarFallback>{chainInfo.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                      </div>
                                      <span className="text-sm">{chainInfo.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatAPY(item.apyBase)}
                                  </TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatAPY(item.apyReward)}
                                  </TableCell>
                                  <TableCell className="text-right font-medium text-green-600">
                                    {formatAPY(item.apy)}
                                  </TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatAPY(item.apyPct7D)}
                                  </TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatAPY(item.apyMean30d)}
                                  </TableCell>
                                  <TableCell className="font-medium">{formatTVL(item.tvlUsd)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="h-8">
                                      <span>Details</span>
                                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="md:hidden">
                        <div className="divide-y">
                          {currentItems.map((item, index) => {
                            const chainInfo = getChainInfo(item.chain.toLowerCase())
                            const inWatchlist = user && isInWatchlist(item.pool)

                            return (
                              <MobileDataCard
                                key={index}
                                project={item.project}
                                symbol={item.symbol}
                                apy={item.apy}
                                apyBase={item.apyBase}
                                apyReward={item.apyReward}
                                apy7d={item.apyPct7D}
                                apy30d={item.apyMean30d}
                                tvl={item.tvlUsd}
                                chain={item.chain.toLowerCase()}
                                stablecoin={item.stablecoin}
                                inWatchlist={inWatchlist}
                                onWatchlistToggle={() => handleWatchlistToggle(item.pool)}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {(indexOfFirstItem + 1).toLocaleString()}-{Math.min(indexOfLastItem, filteredData.length).toLocaleString()}
                    </span>{" "}
                    of <span className="font-medium">{filteredData.length.toLocaleString()}</span> opportunities
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1
                      return (
                        <Button
                          key={i}
                          variant="outline"
                          size="icon"
                          className={`h-8 w-8 ${currentPage === pageNumber ? "bg-primary/10" : ""}`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          <span className="text-xs">{pageNumber}</span>
                        </Button>
                      )
                    })}
                    {totalPages > 5 && <span className="px-2">...</span>}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Updates</CardTitle>
                  <CardDescription>Latest changes in DeFi yields</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">API Integration Complete</h4>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/30 dark:border-green-800"
                          >
                            New
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          YieldMax now uses real-time data from DeFiLlama API to provide the most accurate yield
                          information.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Just now</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Bookmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">Watchlist Feature Added</h4>
                          <Badge>Update</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Users can now create accounts and save their favorite yield opportunities to a personal
                          watchlist.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">Risk Assessment Update</h4>
                          <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-800"
                          >
                            Important
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Added risk assessment data from DeFiLlama to help users make informed decisions.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 bg-white dark:bg-[#1e293b]">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Logo size="small" />
              <p className="text-sm text-muted-foreground">Transparent DeFi yield tracking</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="ghost" size="sm">
                About
              </Button>
              <Button variant="ghost" size="sm">
                API
              </Button>
              <Button variant="ghost" size="sm">
                Terms
              </Button>
              <Button variant="ghost" size="sm">
                Privacy
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 6v12" />
                  <path d="M6 12h12" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
