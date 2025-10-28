import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchServicesSummary = createAsyncThunk("services/fetchSummary", async ({ startDate, endDate }) => {
  const response = await fetch(
    `https://visits-api.whatsbetter.me/api/booking-funnel-summary?startDate=${startDate}&endDate=${endDate}`,
  )
  const data = await response.json()
  return {
    amount: data.amount,
    amount_services: data.amount_services,
    share: data.amount > 0 ? ((data.amount_services / data.amount) * 100).toFixed(2) : 0,
  }
})

export const fetchMonthlyServicesData = createAsyncThunk(
  "services/fetchMonthlyData",
  async ({ startDate, endDate }) => {
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
        select_services: data.select_services,
        amount_services: data.amount_services,
      })

      current.setMonth(current.getMonth() + 1)
    }

    return months
  },
)

export const fetchServicesList = createAsyncThunk("services/fetchList", async ({ startDate, endDate }) => {
  const response = await fetch(
    `https://visits-api.whatsbetter.me/api/services-summary?startDate=${startDate}&endDate=${endDate}`,
  )
  const data = await response.json()
  return data
})

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    summary: null,
    monthlyData: [],
    servicesList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServicesSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload
      })
      .addCase(fetchServicesSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMonthlyServicesData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMonthlyServicesData.fulfilled, (state, action) => {
        state.loading = false
        state.monthlyData = action.payload
      })
      .addCase(fetchMonthlyServicesData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchServicesList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServicesList.fulfilled, (state, action) => {
        state.loading = false
        state.servicesList = action.payload
      })
      .addCase(fetchServicesList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default servicesSlice.reducer
