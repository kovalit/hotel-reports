"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { DateRangePicker } from "../components/date-range-picker"
import { RevenueTable } from "../components/revenue-table"
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
