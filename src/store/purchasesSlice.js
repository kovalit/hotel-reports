import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = "https://visits-api.whatsbetter.me/api"

// Fetch summary data
export const fetchPurchasesSummary = createAsyncThunk("purchases/fetchSummary", async ({ startDate, endDate }) => {
  const response = await fetch(`${API_BASE_URL}/purchases-summary?startDate=${startDate}&endDate=${endDate}`)
  const data = await response.json()
  return data
})

// Fetch monthly data
export const fetchMonthlyPurchasesData = createAsyncThunk(
  "purchases/fetchMonthlyData",
  async ({ startDate, endDate }) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const monthlyData = []

    const current = new Date(start.getFullYear(), start.getMonth(), 1)

    while (
      current.getFullYear() < end.getFullYear() ||
      (current.getFullYear() === end.getFullYear() && current.getMonth() <= end.getMonth())
    ) {
      const monthStart = new Date(current)
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)

      const monthStartStr = monthStart.toISOString().split("T")[0]
      const monthEndStr = monthEnd.toISOString().split("T")[0]

      const response = await fetch(
        `${API_BASE_URL}/purchases-summary?startDate=${monthStartStr}&endDate=${monthEndStr}`,
      )
      const data = await response.json()

      const curr = {
        month: monthStart.toLocaleDateString("ru-RU", { month: "short", year: "numeric" }),
        monthKey: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
        ...data,
        commission: (data.amount_price || 0) * 0.01,
      }

      monthlyData.push(curr)

      current.setMonth(current.getMonth() + 1)
    }

    // Calculate growth percentages
    for (let i = 0; i < monthlyData.length; i++) {
      if (i > 0) {
        const prev = monthlyData[i - 1]
        const curr = monthlyData[i]

        curr.clientsGrowth = prev.clients_count
          ? ((curr.clients_count - prev.clients_count) / prev.clients_count) * 100
          : 0
        curr.purchasesGrowth = prev.purchases_count
          ? ((curr.purchases_count - prev.purchases_count) / prev.purchases_count) * 100
          : 0
        curr.commissionGrowth = prev.commission ? ((curr.commission - prev.commission) / prev.commission) * 100 : 0
      } else {
        monthlyData[i].clientsGrowth = 0
        monthlyData[i].purchasesGrowth = 0
        monthlyData[i].commissionGrowth = 0
      }
    }

    return monthlyData
  },
)

// Fetch category data
export const fetchPurchasesByCategory = createAsyncThunk(
  "purchases/fetchByCategory",
  async ({ startDate, endDate }) => {
    const response = await fetch(`${API_BASE_URL}/purchases-by-category?startDate=${startDate}&endDate=${endDate}`)
    const data = await response.json()
    return data
  },
)

const purchasesSlice = createSlice({
  name: "purchases",
  initialState: {
    summary: null,
    monthlyData: [],
    categoryData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchPurchasesSummary.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPurchasesSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload
      })
      .addCase(fetchPurchasesSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Monthly data
      .addCase(fetchMonthlyPurchasesData.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMonthlyPurchasesData.fulfilled, (state, action) => {
        state.loading = false
        state.monthlyData = action.payload
      })
      .addCase(fetchMonthlyPurchasesData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Category data
      .addCase(fetchPurchasesByCategory.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPurchasesByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.categoryData = action.payload
      })
      .addCase(fetchPurchasesByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default purchasesSlice.reducer
