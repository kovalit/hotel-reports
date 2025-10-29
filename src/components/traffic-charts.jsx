import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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

// Custom label for first chart showing value and conversion to total
const TrafficCaptureLabel = (props) => {
  const { x, y, width, value, payload } = props
  if (!payload || !payload.total) {
    return null
  }
  const conversion = payload.total > 0 ? ((value / payload.total) * 100).toFixed(2) : 0
  return (
    <g>
      <text x={x + width / 2} y={y - 25} fill="#1f2937" textAnchor="middle" fontSize={16} fontWeight="600">
        {formatLabelValue(value)}
      </text>
      <text x={x + width / 2} y={y - 10} fill="#6b7280" textAnchor="middle" fontSize={12}>
        {conversion}%
      </text>
    </g>
  )
}

// Custom label for second chart showing value and conversion to open_whatsbetter_me
const BookingLabel = (props) => {
  const { x, y, width, value, payload } = props
  if (!payload || !payload.open_whatsbetter_me) {
    return null
  }
  const conversion = payload.open_whatsbetter_me > 0 ? ((value / payload.open_whatsbetter_me) * 100).toFixed(2) : 0
  return (
    <g>
      <text x={x + width / 2} y={y - 25} fill="#1f2937" textAnchor="middle" fontSize={16} fontWeight="600">
        {formatLabelValue(value)}
      </text>
      <text x={x + width / 2} y={y - 10} fill="#6b7280" textAnchor="middle" fontSize={12}>
        {conversion}%
      </text>
    </g>
  )
}

export function TrafficCharts({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground">Нет данных для отображения</div>
  }

  const filteredData = data.filter((item) => {
    const [year, month] = item.monthKey.split("-")
    return Number.parseInt(month) >= 8 // Only include August (8) through December (12)
  })

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Динамика по месяцам</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Перехват уходящего трафика</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData} margin={{ top: 50, right: 20, left: 0, bottom: 0 }}>
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
                <Bar
                  dataKey="open_whatsbetter_me"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  label={(props) => <TrafficCaptureLabel {...props} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Бронирования в whatsbetter.me</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData} margin={{ top: 50, right: 20, left: 0, bottom: 0 }}>
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
                <Bar
                  dataKey="whatsbetter_me_booking"
                  fill="#ec4899"
                  radius={[4, 4, 0, 0]}
                  label={(props) => <BookingLabel {...props} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
