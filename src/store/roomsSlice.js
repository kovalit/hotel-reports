import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Room types with their daily availability
export const ROOMS = [
  { countAvailable: 28, id: "916912424844099585", label: "Делюкс с видом в атриум" },
  { countAvailable: 52, id: "916912424844132353", label: "Делюкс с видом на город с одной большой кроватью" },
  { countAvailable: 14, id: "916912424844165121", label: "Делюкс с видом на город с двумя раздельными кроватями" },
  { countAvailable: 8, id: "916912424844230657", label: "Полулюкс" },
  { countAvailable: 4, id: "916912424844263425", label: "Исторический полулюкс + делюкс с видом на город" },
  { countAvailable: 4, id: "916912424844296193", label: "Полулюкс с террасой" },
  { countAvailable: 4, id: "916912424844361729", label: "Премиум полулюкс" },
  { countAvailable: 4, id: "916912424844394497", label: "Исторический полулюкс" },
  { countAvailable: 16, id: "916912424844492801", label: "Классический люкс" },
  { countAvailable: 6, id: "916912424844525569", label: "Люкс с террасой" },
  { countAvailable: 6, id: "916912424844656641", label: "Представительский люкс с террасой" },
  { countAvailable: 8, id: "916912424844722177", label: "Люкс + делюкс с видом на город" },
  { countAvailable: 4, id: "916912424844787713", label: "Исторический люкс" },
  { countAvailable: 2, id: "916912424844820481", label: "Исторический люкс Wawelberg" },
  { countAvailable: 2, id: "982293271282384897", label: "Музыкальный исторический люкс" },
]

// Fetch room statistics
export const fetchRoomStatistics = createAsyncThunk("rooms/fetchStatistics", async ({ startDate, endDate }) => {
  const response = await fetch(
    `https://visits-api.whatsbetter.me/api/rooms-statistics?startDate=${startDate}&endDate=${endDate}`,
  )
  const data = await response.json()
  return data
})

// Fetch monthly room statistics
export const fetchMonthlyRoomStatistics = createAsyncThunk(
  "rooms/fetchMonthlyStatistics",
  async ({ startDate, endDate }) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const monthlyData = []

    const current = new Date(start.getFullYear(), start.getMonth(), 1)

    while (current <= end) {
      const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)

      const actualStart = monthStart < start ? start : monthStart
      const actualEnd = monthEnd > end ? end : monthEnd

      const startStr = actualStart.toISOString().split("T")[0]
      const endStr = actualEnd.toISOString().split("T")[0]

      const response = await fetch(
        `https://visits-api.whatsbetter.me/api/rooms-statistics?startDate=${startStr}&endDate=${endStr}`,
      )
      const data = await response.json()

      // Calculate days in this month period
      const diffTime = Math.abs(actualEnd - actualStart)
      const daysInPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      // Calculate total nights from statistics
      const totalNights = data.reduce((sum, stat) => sum + (stat.nightsCount || 0), 0)

      // Calculate maximum occupancy for this month
      const totalRooms = ROOMS.reduce((sum, room) => sum + room.countAvailable, 0)
      const maxOccupancy = totalRooms * daysInPeriod

      // Calculate occupancy percentage
      const occupancyPercentage = maxOccupancy > 0 ? (totalNights / maxOccupancy) * 100 : 0

      monthlyData.push({
        month: monthStart.toLocaleDateString("ru-RU", { month: "short", year: "numeric" }),
        monthKey: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
        occupancyPercentage,
        totalNights,
        maxOccupancy,
      })

      current.setMonth(current.getMonth() + 1)
    }

    return monthlyData
  },
)

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    statistics: [],
    monthlyStatistics: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomStatistics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoomStatistics.fulfilled, (state, action) => {
        state.loading = false
        state.statistics = action.payload
      })
      .addCase(fetchRoomStatistics.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMonthlyRoomStatistics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMonthlyRoomStatistics.fulfilled, (state, action) => {
        state.loading = false
        state.monthlyStatistics = action.payload
      })
      .addCase(fetchMonthlyRoomStatistics.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default roomsSlice.reducer
