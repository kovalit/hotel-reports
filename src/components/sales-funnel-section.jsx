"use client"

import { useState, useEffect } from "react"
import { SalesFunnel } from "./sales-funnel"

export function SalesFunnelSection({ startDate, endDate }) {
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://visits-api.whatsbetter.me/api/booking-funnel-summary?startDate=${startDate}&endDate=${endDate}`,
        )
        const result = await response.json()

        // Group data by month
        const monthlyGroups = {}

        result.forEach((item) => {
          const date = new Date(item.date)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

          if (!monthlyGroups[monthKey]) {
            monthlyGroups[monthKey] = {
              total: 0,
              open_booking_module: 0,
              select_room: 0,
              select_rateplan: 0,
              select_services: 0,
              registration: 0,
              booking: 0,
              pay: 0,
            }
          }

          monthlyGroups[monthKey].total += item.total || 0
          monthlyGroups[monthKey].open_booking_module += item.open_booking_module || 0
          monthlyGroups[monthKey].select_room += item.select_room || 0
          monthlyGroups[monthKey].select_rateplan += item.select_rateplan || 0
          monthlyGroups[monthKey].select_services += item.select_services || 0
          monthlyGroups[monthKey].registration += item.registration || 0
          monthlyGroups[monthKey].booking += item.booking || 0
          monthlyGroups[monthKey].pay += item.pay || 0
        })

        // Convert to array and sort by date
        const monthlyArray = Object.entries(monthlyGroups)
          .map(([monthKey, data]) => ({
            month: monthKey,
            ...data,
          }))
          .sort((a, b) => a.month.localeCompare(b.month))

        setMonthlyData(monthlyArray)
      } catch (error) {
        console.error("Error fetching funnel data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Загрузка воронки продаж...</div>
      </div>
    )
  }

  const formatMonthYear = (monthKey) => {
    const [year, month] = monthKey.split("-")
    const date = new Date(year, Number.parseInt(month) - 1)
    return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      {monthlyData.map((data) => (
        <SalesFunnel key={data.month} data={data} title="Воронка продаж" dateRange={formatMonthYear(data.month)} />
      ))}
    </div>
  )
}

export { SalesFunnelSection as default }
