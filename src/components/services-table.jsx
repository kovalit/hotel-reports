import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function ServicesTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Список услуг</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Нет данных для отображения</div>
        </CardContent>
      </Card>
    )
  }

  const totalAmount = data.reduce((sum, service) => sum + service.amount_price, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Список услуг</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">№</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Название услуги</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Количество</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Общая стоимость</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Доля, %</th>
                </tr>
              </thead>
              <tbody>
                {data.map((service, index) => {
                  const share = totalAmount > 0 ? ((service.amount_price / totalAmount) * 100).toFixed(2) : 0
                  return (
                    <tr key={service.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm text-foreground">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{service.label}</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">{service.count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        ₽{service.amount_price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">{share}%</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-muted/30 font-semibold">
                  <td className="px-4 py-3 text-sm text-foreground" colSpan="2">
                    Итого
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">
                    {data.reduce((sum, s) => sum + s.count, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">₽{totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">100.00%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
