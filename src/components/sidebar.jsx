import { Link, useLocation } from "react-router-dom"
import { BarChart3, FileText, Users, Calendar, ExternalLink, ShoppingCart, DollarSign } from "lucide-react"

const menuItems = [
  { id: "booking-report", label: "Бронирования", icon: BarChart3, path: "/booking-report" },
  { id: "services-report", label: "Услуги", icon: FileText, path: "/services-report" },
  { id: "traffic-report", label: "Уходящий трафик", icon: ExternalLink, path: "/traffic-report" },
  { id: "purchases-report", label: "Покупки гостей", icon: ShoppingCart, path: "/purchases-report" },
  { id: "room-occupancy", label: "Заполняемость", icon: Calendar, path: "/room-occupancy" },
  { id: "revenue", label: "Доходы", icon: DollarSign, path: "/revenue" },
  // { id: "guest-report", label: "Гости", icon: Users, path: "#" },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card overflow-y-auto">
      <div className="p-4">
        <div className="px-4 py-2 mb-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Отчеты</h3>
        </div>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              location.pathname === item.path || (location.pathname === "/" && item.id === "booking-report")

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors text-left ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
