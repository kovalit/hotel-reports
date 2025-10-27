import { createBrowserRouter } from "react-router-dom"
import { BookingReportPage } from "../pages/booking-report-page"
import { IncomeReportPage } from "../pages/income-report-page"
import { Layout } from "../components/layout"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <BookingReportPage />,
      },
      {
        path: "booking-report",
        element: <BookingReportPage />,
      },
      {
        path: "income-report",
        element: <IncomeReportPage />,
      },
    ],
  },
])
