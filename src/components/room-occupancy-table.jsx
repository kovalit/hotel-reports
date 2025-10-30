"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { ROOMS } from "../store/roomsSlice"

export function RoomOccupancyTable({ statistics, startDate, endDate, loading }) {
  const [sortConfig, setSortConfig] = useState({ key: "occupancy", direction: "desc" })

  // Calculate number of days between dates
  const daysBetween = useMemo(() => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end dates
    return diffDays
  }, [startDate, endDate])

  // Merge statistics with room info and calculate occupancy
  const tableData = useMemo(() => {
    if (!statistics || statistics.length === 0) return []

    return statistics
      .map((stat) => {
        const room = ROOMS.find((r) => r.id === stat.id)
        if (!room) return null

        const maxOccupancy = room.countAvailable * daysBetween
        const occupancy = maxOccupancy > 0 ? (stat.nightsCount / maxOccupancy) * 100 : 0

        return {
          id: stat.id,
          label: stat.label || room.label,
          nightsCount: stat.nightsCount || 0,
          amount_price: stat.amount_price || 0,
          occupancy,
          maxOccupancy,
        }
      })
      .filter(Boolean)
  }, [statistics, daysBetween])

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...tableData]
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }
    return sorted
  }, [tableData, sortConfig])

  // Calculate totals
  const totals = useMemo(() => {
    return sortedData.reduce(
      (acc, row) => ({
        nightsCount: acc.nightsCount + row.nightsCount,
        amount_price: acc.amount_price + row.amount_price,
      }),
      { nightsCount: 0, amount_price: 0 },
    )
  }, [sortedData])

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const SortButton = ({ columnKey, children }) => {
    const isActive = sortConfig.key === columnKey
    const Icon = isActive ? (sortConfig.direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown

    return (
      <button
        onClick={() => handleSort(columnKey)}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {children}
        <Icon className="h-4 w-4" />
      </button>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6 text-center text-muted-foreground">Загрузка данных...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold">Заполняемость по номерам</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <SortButton columnKey="id">№</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <SortButton columnKey="label">Название номера</SortButton>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                <SortButton columnKey="nightsCount">Количество ночей</SortButton>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                <SortButton columnKey="amount_price">Общая стоимость</SortButton>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                <SortButton columnKey="occupancy">Заполняемость</SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedData.map((row, index) => (
              <tr key={row.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm">{index + 1}</td>
                <td className="px-4 py-3 text-sm">{row.label}</td>
                <td className="px-4 py-3 text-sm text-right">{row.nightsCount.toLocaleString("ru-RU")}</td>
                <td className="px-4 py-3 text-sm text-right">{row.amount_price.toLocaleString("ru-RU")} ₽</td>
                <td className="px-4 py-3 text-sm text-right font-medium">{row.occupancy.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/50 font-semibold">
            <tr className="border-t-2 border-border">
              <td className="px-4 py-3 text-sm" colSpan="2">
                Итого
              </td>
              <td className="px-4 py-3 text-sm text-right">{totals.nightsCount.toLocaleString("ru-RU")}</td>
              <td className="px-4 py-3 text-sm text-right">{totals.amount_price.toLocaleString("ru-RU")} ₽</td>
              <td className="px-4 py-3 text-sm text-right"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
