import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { TrendingUp, Users, DollarSign, Home, Sparkles } from "lucide-react"

export function MetricsCards({ data }) {
  const conversion = data.total > 0 ? ((data.pay / data.total) * 100).toFixed(2) : 0

  const metrics = [
    {
      title: "Количество посещений",
      value: data.total.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Количество бронирований",
      value: data.pay.toLocaleString(),
      subtitle: `${conversion}% конверсия`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Сумма бронирований",
      value: `$${data.amount.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Общая стоимость номеров",
      value: `$${data.amount_rooms.toLocaleString()}`,
      icon: Home,
      color: "text-orange-600",
    },
    {
      title: "Общая стоимость доп. услуг",
      value: `$${data.amount_services.toLocaleString()}`,
      icon: Sparkles,
      color: "text-pink-600",
    },
  ]

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Общие результаты</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                {metric.subtitle && <p className="text-xs text-muted-foreground">{metric.subtitle}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
