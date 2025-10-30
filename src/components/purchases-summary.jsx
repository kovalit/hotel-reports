import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function PurchasesSummary({ summary, bookingFunnelData, whatsbetterData }) {
  if (!summary) {
    return <div className="text-muted-foreground">Загрузка...</div>
  }

  const commission = (summary.amount_price || 0) * 0.01

  const total = bookingFunnelData?.total || 0
  const registration = bookingFunnelData?.registration || 0
  const whatsbetterBooking = whatsbetterData?.whatsbetter_me_booking || 0
  const clientsCount = summary.clients_count || 0

  const conversionFromVisits = total > 0 ? (clientsCount / total) * 100 : 0
  const conversionFromRegistered =
    whatsbetterBooking + registration > 0 ? (clientsCount / (whatsbetterBooking + registration)) * 100 : 0

  const metrics = [
    {
      title: "Количество покупателей",
      value: summary.clients_count?.toLocaleString("ru-RU") || "0",
      conversions: [
        { label: "Из визитов", value: conversionFromVisits },
        { label: "Из зарегистрированных", value: conversionFromRegistered },
      ],
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
            {metric.conversions && (
              <div className="mt-2 space-y-1">
                {metric.conversions.map((conv, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground">
                    {conv.label}: {conv.value.toFixed(2)}%
                  </div>
                ))}
              </div>
            )}
            {metric.subtitle && <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
