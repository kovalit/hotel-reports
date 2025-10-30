import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

function GrowthLabel({ x, y, width, value, growth }) {
  return (
    <g>
      <text x={x + width / 2} y={y - 25} fill="currentColor" textAnchor="middle" fontSize={16} fontWeight="600">
        {value?.toLocaleString("ru-RU") || "0"}
      </text>
      <text
        x={x + width / 2}
        y={y - 10}
        fill={growth > 0 ? "#22c55e" : growth < 0 ? "#ef4444" : "currentColor"}
        textAnchor="middle"
        fontSize={12}
      >
        {growth > 0 ? "+" : ""}
        {growth?.toFixed(1) || "0"}%
      </text>
    </g>
  )
}

export function PurchasesCharts({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-muted-foreground">Нет данных для отображения</div>
  }

  const filteredData = data.filter((item) => {
    const monthNum = Number.parseInt(item.monthKey.split("-")[1])
    return monthNum >= 8
  })

  const formatValue = (value) => {
    if (value > 1000000) {
      return `${(value / 1000).toFixed(0)}k`
    }
    return value
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Динамика по месяцам</h2>

      <div className="grid gap-6 md:grid-cols-1">
        {/* Clients Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Количество покупателей</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={filteredData} margin={{ top: 40, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatValue} />
                <Bar dataKey="clients_count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="clients_count"
                    content={(props) => (
                      <GrowthLabel {...props} growth={filteredData[props.index]?.clientsGrowth || 0} />
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Purchases Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Количество покупок</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={filteredData} margin={{ top: 40, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatValue} />
                <Bar dataKey="purchases_count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="purchases_count"
                    content={(props) => (
                      <GrowthLabel {...props} growth={filteredData[props.index]?.purchasesGrowth || 0} />
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Commission Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Вознаграждение</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={filteredData} margin={{ top: 40, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatValue} />
                <Bar dataKey="commission" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="commission"
                    content={(props) => (
                      <GrowthLabel {...props} growth={filteredData[props.index]?.commissionGrowth || 0} />
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
