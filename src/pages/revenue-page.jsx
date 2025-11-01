"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { DateRangePicker } from "../components/date-range-picker"
import { RevenueTable } from "../components/revenue-table"
import { Button } from "@/components/ui/button"
import {
  fetchBookingFunnelData,
  fetchWhatsbetterData,
  fetchNewClientsPurchasesData,
  fetchAllPurchasesData,
} from "../store/revenueSlice"

export function RevenuePage() {
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState("2024-08-01")
  const [endDate, setEndDate] = useState("2024-08-31")

  const months = [
    { name: "Август", start: "2024-08-01", end: "2024-08-31" },
    { name: "Сентябрь", start: "2024-09-01", end: "2024-09-30" },
    { name: "Октябрь", start: "2024-10-01", end: "2024-10-31" },
    { name: "Ноябрь", start: "2024-11-01", end: "2024-11-30" },
    { name: "Декабрь", start: "2024-12-01", end: "2024-12-31" },
  ]

  const handleMonthClick = (start, end) => {
    setStartDate(start)
    setEndDate(end)
  }

  useEffect(() => {
    // Fetch all data when dates change
    dispatch(fetchBookingFunnelData({ startDate, endDate }))
    dispatch(fetchWhatsbetterData({ startDate, endDate }))
    dispatch(fetchNewClientsPurchasesData({ startDate, endDate }))
    dispatch(fetchAllPurchasesData({ startDate, endDate }))
  }, [dispatch, startDate, endDate])

  return (
    <div className="p-6 space-y-6">
      {/* Header with date picker */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Доходы</h1>

      </div>

      <div className="flex items-center justify-between">
      <div className="flex gap-2 flex-wrap">
        {months.map((month) => (
          <Button
          className="cursor-pointer rounded-xl border-0"
            key={month.name}
            variant={startDate === month.start && endDate === month.end ? "default" : "outline"}
            onClick={() => handleMonthClick(month.start, month.end)}
          >
            {month.name}
          </Button>
        ))}
      </div>

      <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
      />
      </div>

      {/* Revenue table */}
      <RevenueTable startDate={startDate} endDate={endDate} />
    </div>
  )
}
