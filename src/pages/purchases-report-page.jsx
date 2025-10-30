"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPurchasesSummary, fetchMonthlyPurchasesData, fetchPurchasesByCategory } from "../store/purchasesSlice"
import { DateRangePicker } from "../components/date-range-picker"
import { PurchasesSummary } from "../components/purchases-summary"
import { PurchasesCharts } from "../components/purchases-charts"
import { PurchasesCategoryTable } from "../components/purchases-category-table"

export function PurchasesReportPage() {
  const dispatch = useDispatch()
  const { summary, monthlyData, categoryData, loading } = useSelector((state) => state.purchases)

  const [startDate, setStartDate] = useState("2024-08-01")
  const [endDate, setEndDate] = useState("2024-12-31")

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(fetchPurchasesSummary({ startDate, endDate }))
      dispatch(fetchMonthlyPurchasesData({ startDate, endDate }))
      dispatch(fetchPurchasesByCategory({ startDate, endDate }))
    }
  }, [dispatch, startDate, endDate])

  return (
    <div className="space-y-6">
      {/* Header with date picker */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Покупки гостей</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {loading && <div className="text-muted-foreground">Загрузка данных...</div>}

      {/* Summary Section */}
      <PurchasesSummary summary={summary} />

      {/* Monthly Charts */}
      <PurchasesCharts data={monthlyData} />

      {/* Category Table */}
      <PurchasesCategoryTable data={categoryData} />
    </div>
  )
}

export default PurchasesReportPage
