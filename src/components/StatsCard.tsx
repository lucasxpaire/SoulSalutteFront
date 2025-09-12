import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "primary" | "success" | "warning" | "info"
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon: Icon, trend, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary",
    success: "text-green-600",
    warning: "text-orange-500",
    info: "text-blue-600",
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-muted/50 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          {trend && (
            <div className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

export default StatsCard
