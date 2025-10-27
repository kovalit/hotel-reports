"use client"

import { useEffect, useState } from "react"
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

const CustomLabel = (props) => {
  const { x, y, value } = props
  return (
    <text x={x} y={y - 10} fill="#374151" textAnchor="middle" fontSize={11} fontWeight={500}>
      {formatLabel(value)}
    </text>
  )
}

export function ChartsSection({ startDate, endDate }) {
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true)
      try {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const months = []

        const current = new Date(start.getFullYear(), start.getMonth(), 1)
        while (
          current.getFullYear() < end.getFullYear() ||
          (current.getFullYear() === end.getFullYear() && current.getMonth() <= end.getMonth())
        ) {
          const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
          const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)

          const response = await fetch(
            `https://visits-api.whatsbetter.me/api/booking-funnel-summary?startDate=${monthStart.toISOString().split("T")[0]}&endDate=${monthEnd.toISOString().split("T")[0]}`,
          )
          const data = await response.json()

          months.push({
            month: monthStart.toLocaleDateString("ru-RU", { month: "short", year: "numeric" }),
            visits: data.total,
            bookings: data.pay,
            conversion: data.total > 0 ? ((data.pay / data.total) * 100).toFixed(2) : 0,
            amount: data.amount,
            roomPrices: data.amount_rooms,
            services: data.amount_services,
          })

          current.setMonth(current.getMonth() + 1)
        }

        setMonthlyData(months)
      } catch (error) {
        console.error("Error fetching monthly data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMonthlyData()
  }, [startDate, endDate])

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
    { title: "Конверсия (%)", dataKey: "conversion", color: "#8b5cf6" },
    { title: "Сумма бронирований ($)", dataKey: "amount", color: "#f59e0b" },
    { title: "Общая стоимость номеров ($)", dataKey: "roomPrices", color: "#ef4444" },
    { title: "Общая стоимость доп. услуг ($)", dataKey: "services", color: "#ec4899" },
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
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
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
                    label={<CustomLabel />}
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
