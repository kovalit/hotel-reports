import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = "https://visits-api.whatsbetter.me/api"

// Fetch summary data
export const fetchTrafficSummary = createAsyncThunk("traffic/fetchSummary", async ({ startDate, endDate }) => {
  const response = await fetch(`${API_BASE_URL}/whatsbetter-summary?startDate=${startDate}&endDate=${endDate}`)
  if (!response.ok) {
    throw new Error("Failed to fetch traffic summary")
  }
  return response.json()
})

// Fetch hotels data
export const fetchTrafficHotels = createAsyncThunk("traffic/fetchHotels", async ({ startDate, endDate }) => {
  const response = await fetch(`${API_BASE_URL}/whatsbetter-hotels?startDate=${startDate}&endDate=${endDate}`)
  if (!response.ok) {
    throw new Error("Failed to fetch traffic hotels")
  }
  return response.json()
})

export const fetchMonthlyTrafficData = createAsyncThunk("traffic/fetchMonthly", async ({ startDate, endDate }) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const monthlyData = []

  const current = new Date(start)
  while (
    current.getFullYear() < end.getFullYear() ||
    (current.getFullYear() === end.getFullYear() && current.getMonth() <= end.getMonth())
  ) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)

    const monthStartStr = monthStart.toISOString().split("T")[0]
    const monthEndStr = monthEnd.toISOString().split("T")[0]

    const response = await fetch(
      `${API_BASE_URL}/whatsbetter-summary?startDate=${monthStartStr}&endDate=${monthEndStr}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch monthly traffic data")
    }
    const data = await response.json()

    monthlyData.push({
      month: monthStart.toLocaleDateString("ru-RU", { month: "short", year: "numeric" }),
      monthKey: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
      ...data,
    })

    current.setMonth(current.getMonth() + 1)
  }

  return monthlyData
})

const trafficSlice = createSlice({
  name: "traffic",
  initialState: {
    summary: null,
    hotels: [],
    monthlyData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchTrafficSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrafficSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload
      })
      .addCase(fetchTrafficSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Hotels
      .addCase(fetchTrafficHotels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrafficHotels.fulfilled, (state, action) => {
        state.loading = false
        state.hotels = action.payload
      })
      .addCase(fetchTrafficHotels.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMonthlyTrafficData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMonthlyTrafficData.fulfilled, (state, action) => {
        state.loading = false
        state.monthlyData = action.payload
      })
      .addCase(fetchMonthlyTrafficData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default trafficSlice.reducer
