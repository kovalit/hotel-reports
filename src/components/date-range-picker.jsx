"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { ruRU } from "@mui/x-date-pickers/locales"
import dayjs from "dayjs"
import "dayjs/locale/ru"

export function DateRangePicker({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" })
  }

  const handleStartDateSelect = (date) => {
    if (date) {
      const year = date.year()
      const month = String(date.month() + 1).padStart(2, "0")
      const day = String(date.date()).padStart(2, "0")
      onStartDateChange(`${year}-${month}-${day}`)
      setStartOpen(false)
    }
  }

  const handleEndDateSelect = (date) => {
    if (date) {
      const year = date.year()
      const month = String(date.month() + 1).padStart(2, "0")
      const day = String(date.date()).padStart(2, "0")
      onEndDateChange(`${year}-${month}-${day}`)
      setEndOpen(false)
    }
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ru"
      localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Период:</span>
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? formatDate(startDate) : "Выберите дату начала"}
              </Button>
            </PopoverTrigger>
            {startOpen && (
              <PopoverContent className="w-auto p-0" align="end">
                <DateCalendar
                  value={startDate ? dayjs(startDate) : null}
                  onChange={handleStartDateSelect}
                  defaultValue={startDate ? dayjs(startDate) : dayjs()}
                />
              </PopoverContent>
            )}
          </Popover>

          <span className="text-muted-foreground">до</span>

          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? formatDate(endDate) : "Выберите дату окончания"}
              </Button>
            </PopoverTrigger>
            {endOpen && (
              <PopoverContent className="w-auto p-0" align="end">
                <DateCalendar
                  value={endDate ? dayjs(endDate) : null}
                  onChange={handleEndDateSelect}
                  defaultValue={endDate ? dayjs(endDate) : dayjs()}
                />
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>
    </LocalizationProvider>
  )
}
