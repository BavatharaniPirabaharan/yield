"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ChainInfo } from "@/lib/api"
import { ArrowRight, Star, StarOff } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface MobileDataCardProps {
  platform: string
  description: string
  apy24h: string
  apy30d: string
  apyLifetime: string
  tvl: string
  days: number
  chain: string
  chainData: ChainInfo
  inWatchlist?: boolean
  onWatchlistToggle?: () => void
}

export function MobileDataCard({
  platform,
  description,
  apy24h,
  apy30d,
  apyLifetime,
  tvl,
  days,
  chain,
  chainData,
  inWatchlist = false,
  onWatchlistToggle,
}: MobileDataCardProps) {
  return (
    <Card className="mb-2 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{platform}</h3>
              <div className="flex items-center gap-1">
                <Avatar className="h-4 w-4">
                  <AvatarImage
                    src={chainData.logoURI}
                    alt={chainData.name}
                  />
                  <AvatarFallback className={`h-4 w-4 rounded-full ${chainData.color}`}>
                    {chainData.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="outline" className="text-xs">
                  {chainData.name}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {onWatchlistToggle && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onWatchlistToggle}>
              {inWatchlist ? (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              ) : (
                <StarOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-xs text-muted-foreground">APY</div>
            <div className="font-medium text-green-600">{apy24h}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">TVL</div>
            <div className="font-medium">{tvl}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-xs text-muted-foreground">7D APY</div>
            <div className="font-medium">{apy30d}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">30D APY</div>
            <div className="font-medium">{apyLifetime}</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">{days} days of data</div>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            Details
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
