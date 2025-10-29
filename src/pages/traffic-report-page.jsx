"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTrafficSummary, fetchTrafficHotels } from "../store/trafficSlice"
import { DateRangePicker } from "../components/date-range-picker"
import { TrafficSummary } from "../components/traffic-summary"
import { TrafficHotelsTable } from "../components/traffic-hotels-table"

export function TrafficReportPage() {
  const dispatch = useDispatch()
  const { summary, hotels, loading, error } = useSelector((state) => state.traffic)

  const [startDate, setStartDate] = useState("2024-08-01")
  const [endDate, setEndDate] = useState("2024-12-31")

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(fetchTrafficSummary({ startDate, endDate }))
      dispatch(fetchTrafficHotels({ startDate, endDate }))
    }
  }, [dispatch, startDate, endDate])

  return (
    <div className="space-y-6">
      {/* Header with title and date picker */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Уходящий трафик</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Loading state */}
      {loading && <div className="text-center py-8 text-muted-foreground">Загрузка данных...</div>}

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">Ошибка загрузки данных: {error}</div>
      )}

      {/* Summary section */}
      {!loading && !error && (
        <>
          <TrafficSummary summary={summary} />

          {/* Hotels table section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Детализация по отелям</h2>
            <TrafficHotelsTable hotels={hotels} />
          </div>
        </>
      )}
    </div>
  )
}

export default TrafficReportPage
