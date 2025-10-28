import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { DollarSign, Sparkles, Percent } from "lucide-react"

export function ServicesSummary({ data }) {
  if (!data) return null

  const metrics = [
    {
      title: "Общая сумма бронирований",
      value: `₽${data.amount.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Общая стоимость услуг",
      value: `₽${data.amount_services.toLocaleString()}`,
      icon: Sparkles,
      color: "text-pink-600",
    },
    {
      title: "Доля услуг в общей стоимости",
      value: `${data.share}%`,
      icon: Percent,
      color: "text-green-600",
    },
  ]

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Общая сводка</h2>
      <div className="grid gap-4 md:grid-cols-3">
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
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
