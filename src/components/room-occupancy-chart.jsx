import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

function OccupancyLabel({ x, y, width, value }) {
  return (
    <text x={x + width / 2} y={y - 10} fill="currentColor" textAnchor="middle" fontSize={14} fontWeight="600">
      {value?.toFixed(1)}%
    </text>
  )
}

export function RoomOccupancyChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-muted-foreground">Нет данных для отображения</div>
  }

  // Filter to show only August onwards
  const filteredData = data.filter((item) => {
    const monthNum = Number.parseInt(item.monthKey.split("-")[1])
    return monthNum >= 8
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Заполняемость по месяцам</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Заполняемость
            <span className="block text-sm font-normal text-muted-foreground mt-1">При бронировании на сайте</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredData} margin={{ top: 30, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Bar dataKey="occupancyPercentage" fill="#22c55e" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="occupancyPercentage"
                  content={(props) => (
                    <OccupancyLabel {...props} value={filteredData[props.index]?.occupancyPercentage} />
                  )}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
