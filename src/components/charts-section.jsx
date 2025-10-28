"use client"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const formatValue = (value) => {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`
  }
  return Math.round(value)
}

const formatLabel = (value) => {
  if (value > 1000000) {
    return `${Math.round(value / 1000)}k`
  }
  return Math.round(value)
}

const ConversionLabel = (props) => {
  const { x, y, value } = props
  return (
    <text x={x} y={y - 10} fill="#374151" textAnchor="middle" fontSize={11} fontWeight={500}>
      {Number(value).toFixed(2)}
    </text>
  )
}

const CustomLabel = (props) => {
  const { x, y, value } = props
  return (
    <text x={x} y={y - 10} fill="#374151" textAnchor="middle" fontSize={11} fontWeight={500}>
      {formatLabel(value)}
    </text>
  )
}

export function ChartsSection() {
  const { monthlyData, loading } = useSelector((state) => state.booking)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Загрузка графиков...</div>
      </div>
    )
  }

  const charts = [
    { title: "Количество посещений", dataKey: "visits", color: "#3b82f6" },
    { title: "Количество бронирований", dataKey: "bookings", color: "#10b981" },
    { title: "Конверсия (%)", dataKey: "conversion", color: "#8b5cf6", labelComponent: ConversionLabel },
    { title: "Сумма бронирований (₽)", dataKey: "amount", color: "#f59e0b" },
    { title: "Общая стоимость номеров (₽)", dataKey: "roomPrices", color: "#ef4444" },
    { title: "Общая стоимость доп. услуг (₽)", dataKey: "services", color: "#ec4899" },
  ]

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Динамика по месяцам</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {charts.map((chart) => (
          <Card key={chart.title}>
            <CardHeader>
              <CardTitle className="text-base">{chart.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} tickFormatter={formatValue} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={chart.dataKey}
                    stroke={chart.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    label={chart.labelComponent || <CustomLabel />}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
