import { NextResponse } from "next/server"
import type { YieldData } from "@/lib/api"

export async function GET() {
  try {
    const API_KEY = process.env.DEFILLAMA_API_KEY || ""

    const response = await fetch("https://yields.llama.fi/pools", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const data: YieldData = await response.json()

    // Sort by APY (highest first)
    const sortedData = data.data.sort((a, b) => b.apy - a.apy)

    return NextResponse.json(sortedData)
  } catch (error) {
    console.error("Error fetching yield data:", error)
    return NextResponse.json({ error: "Failed to fetch yield data" }, { status: 500 })
  }
}
