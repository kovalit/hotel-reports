"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown } from "lucide-react"

export function PurchasesCategoryTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: "amount_price", direction: "desc" })

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return []

    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle average check calculation
      if (sortConfig.key === "average_check") {
        aValue = a.purchases_count ? a.amount_price / a.purchases_count : 0
        bValue = b.purchases_count ? b.amount_price / b.purchases_count : 0
      }

      // Handle commission calculation
      if (sortConfig.key === "commission") {
        aValue = a.amount_price * 0.01
        bValue = b.amount_price * 0.01
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [data, sortConfig])

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const totals = useMemo(() => {
    if (!data || data.length === 0) return null

    return data.reduce(
      (acc, item) => ({
        clients_count: acc.clients_count + (item.clients_count || 0),
        purchases_count: acc.purchases_count + (item.purchases_count || 0),
        amount_price: acc.amount_price + (item.amount_price || 0),
        commission: acc.commission + (item.amount_price || 0) * 0.01,
      }),
      { clients_count: 0, purchases_count: 0, amount_price: 0, commission: 0 },
    )
  }, [data])

  if (!data || data.length === 0) {
    return <div className="text-muted-foreground">Нет данных для отображения</div>
  }

  const SortButton = ({ columnKey, children }) => (
    <button
      onClick={() => handleSort(columnKey)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Статистика по категориям</h2>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">№</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <SortButton columnKey="category">Название категории</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <SortButton columnKey="clients_count">Количество покупателей</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <SortButton columnKey="purchases_count">Количество покупок</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <SortButton columnKey="average_check">Средний чек</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <SortButton columnKey="amount_price">Сумма покупок</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <SortButton columnKey="commission">Вознаграждение</SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedData.map((item, index) => {
              const averageCheck = item.purchases_count ? item.amount_price / item.purchases_count : 0
              const commission = item.amount_price * 0.01

              return (
                <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{item.category}</td>
                  <td className="px-4 py-3 text-sm">{item.clients_count?.toLocaleString("ru-RU")}</td>
                  <td className="px-4 py-3 text-sm">{item.purchases_count?.toLocaleString("ru-RU")}</td>
                  <td className="px-4 py-3 text-sm">{Math.round(averageCheck).toLocaleString("ru-RU")} ₽</td>
                  <td className="px-4 py-3 text-sm">{item.amount_price?.toLocaleString("ru-RU")} ₽</td>
                  <td className="px-4 py-3 text-sm">{commission.toLocaleString("ru-RU")} ₽</td>
                </tr>
              )
            })}
          </tbody>
          {totals && (
            <tfoot className="bg-muted/50 font-semibold">
              <tr className="border-t-2">
                <td className="px-4 py-3 text-sm" colSpan="2">
                  Итого
                </td>
                <td className="px-4 py-3 text-sm">{totals.clients_count.toLocaleString("ru-RU")}</td>
                <td className="px-4 py-3 text-sm">{totals.purchases_count.toLocaleString("ru-RU")}</td>
                <td className="px-4 py-3 text-sm">—</td>
                <td className="px-4 py-3 text-sm">{totals.amount_price.toLocaleString("ru-RU")} ₽</td>
                <td className="px-4 py-3 text-sm">{totals.commission.toLocaleString("ru-RU")} ₽</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
