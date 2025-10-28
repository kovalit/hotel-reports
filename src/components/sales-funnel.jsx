"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const STAGE_LABELS = {
  open_booking_module: "Открыл модуль\nбронирования",
  select_room: "Выбрал номер",
  select_rateplan: "Выбрал тариф",
  select_services: "Выбрал услуги",
  registration: "Зарегистрировался",
  booking: "Забронировал",
  pay: "Оплатил",
}

const COLORS = [
  "#cfee6e", // light yellow-green
  "#8ee26e", // light green
  "#52ce89", // green
  "#4ac8b5", // teal
  "#45a5a9", // cyan
  "#397878", // dark teal
  "#254c50", // darker teal
]

export function SalesFunnel({ data, title, dateRange }) {
  if (!data || !data.total) {
    return null
  }

  const stages = Object.keys(STAGE_LABELS)
  const stageData = stages.map((key, index) => ({
    key,
    label: STAGE_LABELS[key],
    value: data[key] || 0,
    conversion: (((data[key] || 0) / data.total) * 100).toFixed(0),
    color: COLORS[index],
  }))

  // Calculate funnel trapezoid dimensions
  const funnelHeight = 200
  const maxWidth = 100 // percentage
  const minWidth = 20 // percentage
  const stageWidth = 100 / stages.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Воронка продаж"}</CardTitle>
        {dateRange && <p className="text-sm text-muted-foreground">{dateRange}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Stage columns */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }}>
            {stageData.map((stage) => (
              <div key={stage.key} className="flex flex-col items-center text-center space-y-2">
                <div className="text-sm text-muted-foreground whitespace-pre-line min-h-[40px] flex items-center">
                  {stage.label}
                </div>
                <div className="text-2xl font-bold">{stage.value.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{stage.conversion}%</div>
              </div>
            ))}
          </div>

          {/* Funnel visualization */}
          <div className="relative w-full" style={{ height: `${funnelHeight}px` }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              {stageData.map((stage, index) => {
                if (index === stageData.length - 1) return null // Skip last stage (no trapezoid after it)

                const currentValue = stage.value
                const nextValue = stageData[index + 1].value
                const maxValue = stageData[0].value

                // Calculate widths as percentage of max value
                const currentWidth = (currentValue / maxValue) * (maxWidth - minWidth) + minWidth
                const nextWidth = (nextValue / maxValue) * (maxWidth - minWidth) + minWidth

                const x1 = index * stageWidth
                const x2 = (index + 1) * stageWidth

                // Trapezoid points: top-left, top-right, bottom-right, bottom-left
                const points = `
                  ${x1},${50 - currentWidth / 2}
                  ${x2},${50 - nextWidth / 2}
                  ${x2},${50 + nextWidth / 2}
                  ${x1},${50 + currentWidth / 2}
                `

                return <polygon key={stage.key} points={points} fill={stage.color} stroke="white" strokeWidth="0.2" />
              })}
              {/* Last stage rectangle */}
              {(() => {
                const lastStage = stageData[stageData.length - 1]
                const lastValue = lastStage.value
                const maxValue = stageData[0].value
                const lastWidth = (lastValue / maxValue) * (maxWidth - minWidth) + minWidth
                const x = (stages.length - 1) * stageWidth

                return (
                  <rect
                    x={x}
                    y={50 - lastWidth / 2}
                    width={stageWidth}
                    height={lastWidth}
                    fill={lastStage.color}
                    stroke="white"
                    strokeWidth="0.2"
                  />
                )
              })()}
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { SalesFunnel as default }
