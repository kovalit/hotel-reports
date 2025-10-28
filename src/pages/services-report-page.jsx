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

  const [startDate, setStartDate] = useState("2024-08-01")
  const [endDate, setEndDate] = useState("2024-12-31")

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(fetchServicesSummary({ startDate, endDate }))
      dispatch(fetchMonthlyServicesData({ startDate, endDate }))
      dispatch(fetchServicesList({ startDate, endDate }))
    }
  }, [startDate, endDate, dispatch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Услуги</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
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
