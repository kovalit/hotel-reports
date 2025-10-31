import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = "https://visits-api.whatsbetter.me/api"

// Fetch booking funnel data
export const fetchBookingFunnelData = createAsyncThunk(
  "revenue/fetchBookingFunnelData",
  async ({ startDate, endDate }) => {
    const response = await fetch(`${API_BASE_URL}/booking-funnel-summary?startDate=${startDate}&endDate=${endDate}`)
    return response.json()
  },
)

// Fetch whatsbetter summary data
export const fetchWhatsbetterData = createAsyncThunk("revenue/fetchWhatsbetterData", async ({ startDate, endDate }) => {
  const response = await fetch(`${API_BASE_URL}/whatsbetter-summary?startDate=${startDate}&endDate=${endDate}`)
  return response.json()
})

// Fetch new clients purchases data
export const fetchNewClientsPurchasesData = createAsyncThunk(
  "revenue/fetchNewClientsPurchasesData",
  async ({ startDate, endDate }) => {
    const response = await fetch(
      `${API_BASE_URL}/new-clients-purchases-summary?startDate=${startDate}&endDate=${endDate}`,
    )
    return response.json()
  },
)

// Fetch all purchases data
export const fetchAllPurchasesData = createAsyncThunk(
  "revenue/fetchAllPurchasesData",
  async ({ startDate, endDate }) => {
    const response = await fetch(`${API_BASE_URL}/purchases-summary?startDate=${startDate}&endDate=${endDate}`)
    return response.json()
  },
)

const revenueSlice = createSlice({
  name: "revenue",
  initialState: {
    bookingFunnel: null,
    whatsbetter: null,
    newClientsPurchases: null,
    allPurchases: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Booking funnel
      .addCase(fetchBookingFunnelData.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBookingFunnelData.fulfilled, (state, action) => {
        state.bookingFunnel = action.payload
        state.loading = false
      })
      .addCase(fetchBookingFunnelData.rejected, (state, action) => {
        state.error = action.error.message
        state.loading = false
      })
      // Whatsbetter
      .addCase(fetchWhatsbetterData.fulfilled, (state, action) => {
        state.whatsbetter = action.payload
      })
      // New clients purchases
      .addCase(fetchNewClientsPurchasesData.fulfilled, (state, action) => {
        state.newClientsPurchases = action.payload
      })
      // All purchases
      .addCase(fetchAllPurchasesData.fulfilled, (state, action) => {
        state.allPurchases = action.payload
      })
  },
})

export default revenueSlice.reducer
