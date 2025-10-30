import { createBrowserRouter } from "react-router-dom"
import { BookingReportPage } from "../pages/booking-report-page"
import { IncomeReportPage } from "../pages/income-report-page"
import { ServicesReportPage } from "../pages/services-report-page"
import { TrafficReportPage } from "../pages/traffic-report-page"
import { PurchasesReportPage } from "../pages/purchases-report-page"
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
        path: "services-report",
        element: <ServicesReportPage />,
      },
      {
        path: "traffic-report",
        element: <TrafficReportPage />,
      },
      {
        path: "purchases-report",
        element: <PurchasesReportPage />,
      },
      {
        path: "income-report",
        element: <IncomeReportPage />,
      },
    ],
  },
])
