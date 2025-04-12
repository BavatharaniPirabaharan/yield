"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatAPY, formatTVL, getChainInfo } from "@/lib/api"

interface MobileDataCardProps {
  project: string
  symbol: string
  apy: number
  apyBase: number
  apyReward: number
  apy7d: number
  apy30d: number
  tvl: number
  chain: string
  stablecoin: boolean | null
  inWatchlist: boolean
  onWatchlistToggle: () => void
}

export function MobileDataCard({
  project,
  symbol,
  apy,
  apyBase,
  apyReward,
  apy7d,
  apy30d,
  tvl,
  chain,
  stablecoin,
  inWatchlist,
  onWatchlistToggle,
}: MobileDataCardProps) {
  const chainInfo = getChainInfo(chain)
  const isStablecoin = stablecoin === true;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/info/logo.png`}
                alt={chainInfo.name}
              />
              <AvatarFallback className={`h-8 w-8 rounded-full ${chainInfo.color}`}>
                {chainInfo.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{project}</CardTitle>
              <CardDescription>{symbol}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onWatchlistToggle}
            className={cn(
              "h-8 w-8",
              inWatchlist && "text-yellow-500 hover:text-yellow-600"
            )}
          >
            {inWatchlist ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">APY</span>
            <span className="font-medium text-green-600">{formatAPY(apy)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Base APY</span>
            <span className="font-medium">{formatAPY(apyBase)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Reward APY</span>
            <span className="font-medium">{formatAPY(apyReward)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">7D APY</span>
            <span className="font-medium">{formatAPY(apy7d)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">30D APY</span>
            <span className="font-medium">{formatAPY(apy30d)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">TVL</span>
            <span className="font-medium">{formatTVL(tvl)}</span>
          </div>
          {isStablecoin && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">Stablecoin</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 