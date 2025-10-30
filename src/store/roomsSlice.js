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

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    statistics: [],
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
  },
})

export default roomsSlice.reducer
