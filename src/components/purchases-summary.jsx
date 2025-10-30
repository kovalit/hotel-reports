import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function PurchasesSummary({ summary }) {
  if (!summary) {
    return <div className="text-muted-foreground">Загрузка...</div>
  }

  const commission = (summary.amount_price || 0) * 0.01

  const metrics = [
    {
      title: "Количество покупателей",
      value: summary.clients_count?.toLocaleString("ru-RU") || "0",
    },
    {
      title: "Количество покупок",
      value: summary.purchases_count?.toLocaleString("ru-RU") || "0",
    },
    {
      title: "Сумма покупок",
      value: `${summary.amount_price?.toLocaleString("ru-RU") || "0"} ₽`,
    },
    {
      title: "Вознаграждение",
      value: `${commission.toLocaleString("ru-RU")} ₽`,
      subtitle: "Комиссия 1%",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.subtitle && <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
