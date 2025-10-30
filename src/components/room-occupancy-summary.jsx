import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function RoomOccupancySummary({ occupancyPercentage, loading }) {
  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Общая заполняемость</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-2xl font-semibold text-muted-foreground">Загрузка...</div>
          ) : (
            <div className="text-3xl font-bold">{occupancyPercentage.toFixed(2)}%</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
