"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchServicesSummary, fetchMonthlyServicesData, fetchServicesList } from "../store/servicesSlice"
import { DateRangePicker } from "../components/date-range-picker"
import { ServicesSummary } from "../components/services-summary"
import { ServicesCharts } from "../components/services-charts"
import { ServicesTable } from "../components/services-table"

export function ServicesReportPage() {
  const dispatch = useDispatch()
  const { summary, monthlyData, servicesList, loading } = useSelector((state) => state.services)

  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 7, 1),
    to: new Date(2024, 11, 31),
  })

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const startDate = dateRange.from.toISOString().split("T")[0]
      const endDate = dateRange.to.toISOString().split("T")[0]

      dispatch(fetchServicesSummary({ startDate, endDate }))
      dispatch(fetchMonthlyServicesData({ startDate, endDate }))
      dispatch(fetchServicesList({ startDate, endDate }))
    }
  }, [dateRange, dispatch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Услуги</h1>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      {loading && <div className="text-center text-muted-foreground">Загрузка данных...</div>}

      {!loading && (
        <>
          {summary && <ServicesSummary data={summary} />}
          {monthlyData.length > 0 && <ServicesCharts data={monthlyData} />}
          {servicesList.length > 0 && <ServicesTable data={servicesList} />}
        </>
      )}
    </div>
  )
}

export default ServicesReportPage
