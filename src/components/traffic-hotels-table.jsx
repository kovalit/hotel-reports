"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

export function TrafficHotelsTable({ hotels }) {
  const [sortConfig, setSortConfig] = useState({ key: "amount_price", direction: "desc" })

  const sortedHotels = useMemo(() => {
    if (!hotels || hotels.length === 0) return []

    const sorted = [...hotels].sort((a, b) => {
      let aValue, bValue

      switch (sortConfig.key) {
        case "label":
          aValue = a.label || ""
          bValue = b.label || ""
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue, "ru")
            : bValue.localeCompare(aValue, "ru")
        case "count":
          aValue = a.count || 0
          bValue = b.count || 0
          break
        case "avg_price":
          aValue = a.count > 0 ? a.amount_price / a.count : 0
          bValue = b.count > 0 ? b.amount_price / b.count : 0
          break
        case "amount_price":
          aValue = a.amount_price || 0
          bValue = b.amount_price || 0
          break
        case "commission":
          aValue = (a.amount_price || 0) * 0.1
          bValue = (b.amount_price || 0) * 0.1
          break
        default:
          return 0
      }

      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
    })

    return sorted
  }, [hotels, sortConfig])

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null
    return sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  // Calculate totals
  const totals = useMemo(() => {
    if (!sortedHotels || sortedHotels.length === 0) {
      return { count: 0, amount: 0, commission: 0 }
    }

    return sortedHotels.reduce(
      (acc, hotel) => ({
        count: acc.count + (hotel.count || 0),
        amount: acc.amount + (hotel.amount_price || 0),
        commission: acc.commission + (hotel.amount_price || 0) * 0.1,
      }),
      { count: 0, amount: 0, commission: 0 },
    )
  }, [sortedHotels])

  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6 text-center text-muted-foreground">Нет данных для отображения</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                №
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort("label")}
              >
                <div className="flex items-center gap-1">
                  Название отеля
                  <SortIcon columnKey="label" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort("count")}
              >
                <div className="flex items-center justify-end gap-1">
                  Количество бронирований
                  <SortIcon columnKey="count" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort("avg_price")}
              >
                <div className="flex items-center justify-end gap-1">
                  Средняя цена
                  <SortIcon columnKey="avg_price" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort("amount_price")}
              >
                <div className="flex items-center justify-end gap-1">
                  Общая стоимость
                  <SortIcon columnKey="amount_price" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Размер комиссии
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70"
                onClick={() => handleSort("commission")}
              >
                <div className="flex items-center justify-end gap-1">
                  Сумма вознаграждения
                  <SortIcon columnKey="commission" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {sortedHotels.map((hotel, index) => {
              const avgPrice = hotel.count > 0 ? Math.round(hotel.amount_price / hotel.count) : 0
              const commission = Math.round(hotel.amount_price * 0.1)

              return (
                <tr key={index} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{hotel.label}</td>
                  <td className="px-4 py-3 text-sm text-right">{hotel.count.toLocaleString("ru-RU")}</td>
                  <td className="px-4 py-3 text-sm text-right">{avgPrice.toLocaleString("ru-RU")} ₽</td>
                  <td className="px-4 py-3 text-sm text-right font-bold">
                    {hotel.amount_price.toLocaleString("ru-RU")} ₽
                  </td>
                  <td className="px-4 py-3 text-sm text-right">10%</td>
                  <td className="px-4 py-3 text-sm text-right">{commission.toLocaleString("ru-RU")} ₽</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-muted/50 border-t-2 border-border">
            <tr>
              <td className="px-4 py-3 text-sm font-bold" colSpan="2">
                Итого
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold">{totals.count.toLocaleString("ru-RU")}</td>
              <td className="px-4 py-3 text-sm text-right"></td>
              <td className="px-4 py-3 text-sm text-right font-bold">
                {Math.round(totals.amount).toLocaleString("ru-RU")} ₽
              </td>
              <td className="px-4 py-3 text-sm text-right"></td>
              <td className="px-4 py-3 text-sm text-right font-bold">
                {Math.round(totals.commission).toLocaleString("ru-RU")} ₽
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
