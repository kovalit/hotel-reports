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

const trafficSlice = createSlice({
  name: "traffic",
  initialState: {
    summary: null,
    hotels: [],
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
  },
})

export default trafficSlice.reducer
