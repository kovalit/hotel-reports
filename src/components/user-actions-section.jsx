"use client"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts"

const CustomBarLabel = (props) => {
  const { x, y, width, value, conversion } = props
  return (
    <g>
      <text x={x + width / 2} y={y - 25} fill="#374151" textAnchor="middle" fontSize={11} fontWeight={600}>
        {Math.round(value)}
      </text>
      <text x={x + width / 2} y={y - 10} fill="#6b7280" textAnchor="middle" fontSize={10}>
        {conversion}%
      </text>
    </g>
  )
}

export function UserActionsSection() {
  const { monthlyData, loading } = useSelector((state) => state.booking)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Загрузка данных о действиях пользователей...</div>
      </div>
    )
  }

  const actions = [
    { title: "Открыли модуль бронирования", dataKey: "open_booking_module", color: "#3b82f6" },
    { title: "Выбрали номер", dataKey: "select_room", color: "#10b981" },
    { title: "Выбрали тарифный план", dataKey: "select_rateplan", color: "#8b5cf6" },
    { title: "Выбрали услуги", dataKey: "select_services", color: "#f59e0b" },
    { title: "Зарегистрировались", dataKey: "registration", color: "#ef4444" },
    { title: "Забронировали", dataKey: "booking", color: "#ec4899" },
    { title: "Оплатили", dataKey: "pay", color: "#06b6d4" },
  ]

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Действия пользователей</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {actions.map((action) => {
          const dataWithConversion = monthlyData.map((month) => ({
            ...month,
            conversion: month.total > 0 ? ((month[action.dataKey] / month.total) * 100).toFixed(2) : 0,
          }))

          return (
            <Card key={action.title}>
              <CardHeader>
                <CardTitle className="text-base">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dataWithConversion} margin={{ top: 40, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name, props) => [
                        `${Math.round(value)} (${props.payload.conversion}%)`,
                        action.title,
                      ]}
                    />
                    <Bar dataKey={action.dataKey} fill={action.color} radius={[4, 4, 0, 0]}>
                      <LabelList
                        dataKey={action.dataKey}
                        content={(props) => (
                          <CustomBarLabel {...props} conversion={dataWithConversion[props.index]?.conversion || 0} />
                        )}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default UserActionsSection
