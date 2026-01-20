import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TierBadgeProps {
  tier: number
  className?: string
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  const tierColors = {
    1: "bg-green-100 text-green-800 hover:bg-green-100",
    2: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    3: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    4: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    5: "bg-gray-50 text-gray-600 hover:bg-gray-50",
  }

  const tierColor = tierColors[tier as keyof typeof tierColors] || tierColors[5]

  return (
    <Badge variant="secondary" className={cn(tierColor, className)}>
      Tier {tier}
    </Badge>
  )
}
