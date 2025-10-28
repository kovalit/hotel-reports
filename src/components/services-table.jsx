"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function ServicesTable({ data }) {
  const [sortConfig, setSortConfig] = useState({
    key: "amount_price",
    direction: "desc",
  })

  const totalAmount = data.reduce((sum, service) => sum + service.amount_price, 0)

  const sortedData = useMemo(() => {
    const sorted = [...data]
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle string comparison for label
      if (sortConfig.key === "label") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
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

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="ml-1 text-gray-400">↕</span>
    }
    return <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Список услуг</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Нет данных для отображения</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Список услуг</h2>
      <Card className="bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">№</th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("label")}
                  >
                    Название услуги
                    <SortIndicator columnKey="label" />
                  </th>
                  <th
                    className="px-4 py-3 text-right text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("count")}
                  >
                    Количество
                    <SortIndicator columnKey="count" />
                  </th>
                  <th
                    className="px-4 py-3 text-right text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("amount_price")}
                  >
                    Общая стоимость
                    <SortIndicator columnKey="amount_price" />
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Доля, %</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {sortedData.map((service, index) => {
                  const share = totalAmount > 0 ? ((service.amount_price / totalAmount) * 100).toFixed(2) : 0
                  return (
                    <tr key={service.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm text-foreground">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{service.label}</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">{service.count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        ₽{service.amount_price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">{share}%</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-muted/30 font-semibold">
                  <td className="px-4 py-3 text-sm text-foreground" colSpan="2">
                    Итого
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">
                    {data.reduce((sum, s) => sum + s.count, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">₽{totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">100.00%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
