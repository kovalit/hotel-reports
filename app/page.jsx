"use client"

import { RouterProvider } from "react-router-dom"
import { router } from "../src/router"

export default function Page() {
  return <RouterProvider router={router} />
}
