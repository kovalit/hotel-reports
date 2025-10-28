import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts"

const formatValue = (value) => {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`
  }
  return Math.round(value)
}

const formatLabelValue = (value) => {
  if (value > 1000000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return Math.round(value).toLocaleString()
}

const DataLabel = ({ x, y, value }) => {
  return (
    <text x={x} y={y - 10} fill="#6b7280" textAnchor="middle" fontSize={12}>
      {formatLabelValue(value)}
    </text>
  )
}

export function ServicesCharts({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground">Нет данных для отображения</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Динамика по месяцам</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Количество выбравших услуги</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatValue} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                />
                <Line type="monotone" dataKey="select_services" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }}>
                  <Label content={<DataLabel />} position="top" />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Общая стоимость доп. услуг (₽)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatValue} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                  formatter={(value) => [`₽${value.toLocaleString()}`, "Стоимость"]}
                />
                <Line type="monotone" dataKey="amount_services" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }}>
                  <Label content={<DataLabel />} position="top" />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
