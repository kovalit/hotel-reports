import { configureStore } from "@reduxjs/toolkit"
import bookingReducer from "./bookingSlice"
import servicesReducer from "./servicesSlice"
import trafficReducer from "./trafficSlice"
import purchasesReducer from "./purchasesSlice"

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    services: servicesReducer,
    traffic: trafficReducer,
    purchases: purchasesReducer,
  },
})
