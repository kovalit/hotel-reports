"use client"

import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchRoomStatistics, ROOMS } from "../store/roomsSlice"
import { DateRangePicker } from "../components/date-range-picker"
import { RoomOccupancySummary } from "../components/room-occupancy-summary"
import { RoomOccupancyTable } from "../components/room-occupancy-table"

export function RoomOccupancyPage() {
  const dispatch = useDispatch()
  const { statistics, loading } = useSelector((state) => state.rooms)

  const [startDate, setStartDate] = useState("2024-08-01")
  const [endDate, setEndDate] = useState("2024-12-31")

  // Calculate number of days between dates
  const daysBetween = useMemo(() => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }, [startDate, endDate])

  // Calculate maximum occupancy (sum of all rooms * days)
  const maxOccupancy = useMemo(() => {
    const totalRooms = ROOMS.reduce((sum, room) => sum + room.countAvailable, 0)
    return totalRooms * daysBetween
  }, [daysBetween])

  // Calculate total nights from statistics
  const totalNights = useMemo(() => {
    if (!statistics || statistics.length === 0) return 0
    return statistics.reduce((sum, stat) => sum + (stat.nightsCount || 0), 0)
  }, [statistics])

  // Calculate occupancy percentage
  const occupancyPercentage = useMemo(() => {
    if (maxOccupancy === 0) return 0
    return (totalNights / maxOccupancy) * 100
  }, [totalNights, maxOccupancy])

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(fetchRoomStatistics({ startDate, endDate }))
    }
  }, [dispatch, startDate, endDate])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Заполняемость номеров</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      <RoomOccupancySummary occupancyPercentage={occupancyPercentage} loading={loading} />

      <RoomOccupancyTable statistics={statistics} startDate={startDate} endDate={endDate} loading={loading} />
    </div>
  )
}
