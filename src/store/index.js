import { configureStore } from "@reduxjs/toolkit"
import bookingReducer from "./bookingSlice"
import servicesReducer from "./servicesSlice"

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    services: servicesReducer,
  },
})
