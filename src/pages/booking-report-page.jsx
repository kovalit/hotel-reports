"use client"

import { useState, useEffect } from "react"
import { DateRangePicker } from "../components/date-range-picker"
import { MetricsCards } from "../components/metrics-cards"
import { ChartsSection } from "../components/charts-section"
import { UserActionsSection } from "../components/user-actions-section"
import { SalesFunnelSection } from "../components/sales-funnel-section"

export function BookingReportPage() {
  const [startDate, setStartDate] = useState("2024-08-01")
  const [endDate, setEndDate] = useState("2024-12-31")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://visits-api.whatsbetter.me/api/booking-funnel-summary?startDate=${startDate}&endDate=${endDate}`,
        )
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching booking data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Отчет по бронированиям</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Загрузка данных...</div>
        </div>
      ) : data ? (
        <>
          <MetricsCards data={data} />
          <ChartsSection startDate={startDate} endDate={endDate} />
          <UserActionsSection startDate={startDate} endDate={endDate} />
          <SalesFunnelSection startDate={startDate} endDate={endDate} />
        </>
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Нет доступных данных</div>
        </div>
      )}
    </div>
  )
}

export default BookingReportPage
