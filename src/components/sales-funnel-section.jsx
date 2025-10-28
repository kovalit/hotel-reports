"use client"
import { useSelector } from "react-redux"
import { SalesFunnel } from "./sales-funnel"

export function SalesFunnelSection() {
  const { monthlyData, loading } = useSelector((state) => state.booking)

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
        <SalesFunnel
          key={data.monthKey}
          data={data}
          title="Воронка продаж"
          dateRange={formatMonthYear(data.monthKey)}
        />
      ))}
    </div>
  )
}

export { SalesFunnelSection as default }
