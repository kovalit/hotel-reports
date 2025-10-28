"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMonthlyBookingData, fetchBookingSummary } from "../store/bookingSlice"
import { DateRangePicker } from "../components/date-range-picker"
import { MetricsCards } from "../components/metrics-cards"
import { ChartsSection } from "../components/charts-section"
import { UserActionsSection } from "../components/user-actions-section"
import { SalesFunnelSection } from "../components/sales-funnel-section"

export function BookingReportPage() {
  const [startDate, setStartDate] = useState("2024-08-01")
  const [endDate, setEndDate] = useState("2024-12-31")

  const dispatch = useDispatch()
  const { summaryData, loading, error } = useSelector((state) => state.booking)

  useEffect(() => {
    dispatch(fetchBookingSummary({ startDate, endDate }))
    dispatch(fetchMonthlyBookingData({ startDate, endDate }))
  }, [startDate, endDate, dispatch])

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
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">Ошибка: {error}</div>
        </div>
      ) : summaryData ? (
        <>
          <MetricsCards data={summaryData} />
          <ChartsSection />
          <UserActionsSection />
          <SalesFunnelSection />
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
