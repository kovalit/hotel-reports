"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"

export function DateRangePicker({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" })
  }

  const handleStartDateSelect = (date) => {
    if (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      onStartDateChange(`${year}-${month}-${day}`)
      setStartOpen(false)
    }
  }

  const handleEndDateSelect = (date) => {
    if (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      onEndDateChange(`${year}-${month}-${day}`)
      setEndOpen(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Период:</span>
        <Popover>
          <PopoverTrigger asChild onClick={() => setStartOpen(!startOpen)}>
            <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? formatDate(startDate) : "Выберите дату начала"}
            </Button>
          </PopoverTrigger>
          {startOpen && (
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                selected={startDate ? new Date(startDate) : undefined}
                onSelect={handleStartDateSelect}
                defaultMonth={startDate ? new Date(startDate) : new Date()}
              />
            </PopoverContent>
          )}
        </Popover>

        <span className="text-muted-foreground">до</span>

        <Popover>
          <PopoverTrigger asChild onClick={() => setEndOpen(!endOpen)}>
            <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? formatDate(endDate) : "Выберите дату окончания"}
            </Button>
          </PopoverTrigger>
          {endOpen && (
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                selected={endDate ? new Date(endDate) : undefined}
                onSelect={handleEndDateSelect}
                defaultMonth={endDate ? new Date(endDate) : new Date()}
              />
            </PopoverContent>
          )}
        </Popover>
      </div>
    </div>
  )
}
