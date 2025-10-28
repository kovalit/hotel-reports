import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchMonthlyBookingData = createAsyncThunk("booking/fetchMonthlyData", async ({ startDate, endDate }) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const months = []

  const current = new Date(start.getFullYear(), start.getMonth(), 1)
  while (
    current.getFullYear() < end.getFullYear() ||
    (current.getFullYear() === end.getFullYear() && current.getMonth() <= end.getMonth())
  ) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)

    const response = await fetch(
      `https://visits-api.whatsbetter.me/api/booking-funnel-summary?startDate=${monthStart.toISOString().split("T")[0]}&endDate=${monthEnd.toISOString().split("T")[0]}`,
    )
    const data = await response.json()

    months.push({
      month: monthStart.toLocaleDateString("ru-RU", { month: "short", year: "numeric" }),
      monthKey: `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}`,
      visits: data.total,
      bookings: data.pay,
      conversion: data.total > 0 ? ((data.pay / data.total) * 100).toFixed(2) : 0,
      amount: data.amount,
      roomPrices: data.amount_rooms,
      services: data.amount_services,
      open_booking_module: data.open_booking_module,
      select_room: data.select_room,
      select_rateplan: data.select_rateplan,
      select_services: data.select_services,
      registration: data.registration,
      booking: data.booking,
      pay: data.pay,
      total: data.total,
    })

    current.setMonth(current.getMonth() + 1)
  }

  return months
})

export const fetchBookingSummary = createAsyncThunk("booking/fetchSummary", async ({ startDate, endDate }) => {
  const response = await fetch(
    `https://visits-api.whatsbetter.me/api/booking-funnel-summary?startDate=${startDate}&endDate=${endDate}`,
  )
  const data = await response.json()
  return data
})

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    monthlyData: [],
    summaryData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyBookingData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMonthlyBookingData.fulfilled, (state, action) => {
        state.loading = false
        state.monthlyData = action.payload
      })
      .addCase(fetchMonthlyBookingData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchBookingSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookingSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summaryData = action.payload
      })
      .addCase(fetchBookingSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default bookingSlice.reducer
