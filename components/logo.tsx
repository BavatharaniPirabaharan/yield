import { DollarSign } from "lucide-react"

export function Logo({ size = "default" }: { size?: "default" | "small" }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`bg-[#3b82f6] rounded-md ${size === "small" ? "p-1" : "p-1.5"} flex items-center justify-center`}>
        <DollarSign className={`${size === "small" ? "h-4 w-4" : "h-5 w-5"} text-white`} />
      </div>
      <span className={`${size === "small" ? "text-sm" : "text-xl"} font-bold text-[#3b82f6]`}>YieldMax</span>
    </div>
  )
}
