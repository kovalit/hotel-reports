"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useMemo } from "react"

export function TrafficSummary({ summary, hotels }) {
  // Calculate total commission from hotels data
  const totalCommission = useMemo(() => {
    if (!hotels || hotels.length === 0) return 0
    return hotels.reduce((sum, hotel) => sum + (hotel.amount_price || 0) * 0.1, 0)
  }, [hotels])

  if (!summary) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Загрузка...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const total = summary.total || 0
  const openWhatsbetter = summary.open_whatsbetter_me || 0
  const whatsbetterBooking = summary.whatsbetter_me_booking || 0

  const openConversion = total > 0 ? ((openWhatsbetter / total) * 100).toFixed(2) : "0.00"
  const bookingConversion = total > 0 ? ((whatsbetterBooking / total) * 100).toFixed(2) : "0.00"

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Перешли в whatsbetter.me</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openWhatsbetter.toLocaleString("ru-RU")}</div>
          <p className="text-xs text-muted-foreground mt-1">Конверсия: {openConversion}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Забронировали отель в whatsbetter.me
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{whatsbetterBooking.toLocaleString("ru-RU")}</div>
          <p className="text-xs text-muted-foreground mt-1">Конверсия: {bookingConversion}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Сумма вознаграждения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(totalCommission).toLocaleString("ru-RU")} ₽</div>
          <p className="text-xs text-muted-foreground mt-1">Комиссия 10%</p>
        </CardContent>
      </Card>
    </div>
  )
}
