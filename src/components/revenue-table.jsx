import { useSelector } from "react-redux"

export function RevenueTable({ startDate, endDate }) {
  const { bookingFunnel, whatsbetter, newClientsPurchases, allPurchases } = useSelector((state) => state.revenue)

  if (!bookingFunnel || !whatsbetter || !newClientsPurchases || !allPurchases) {
    return <div className="text-center py-8 text-muted-foreground">Загрузка данных...</div>
  }

  // Calculate metrics
  const registration = bookingFunnel.registration || 0
  const pay = bookingFunnel.pay || 0
  const total = bookingFunnel.total || 1
  const bookingAmount = bookingFunnel.amount || 0

  const openWhatsbetter = whatsbetter.open_whatsbetter_me || 0
  const whatsbetterBooking = whatsbetter.whatsbetter_me_booking || 0
  const whatsbetterAmount = (whatsbetter.amount_price || 0) * 0.1

  const newUsers = registration + whatsbetterBooking
  const newClients = newClientsPurchases.clients_count || 0
  const newClientsPurchasesAmount = (newClientsPurchases.amount_price || 0) * 0.01

  const allClientsCount = allPurchases.clients_count || 0
  const allPurchasesAmount = (allPurchases.amount_price || 0) * 0.01

  const totalRevenue = whatsbetterAmount + allPurchasesAmount

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
  }

  // Progress bar component
  const ProgressBar = ({ value, conversion, bgColor }) => (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
        <div
          className={`h-full ${bgColor} rounded-full transition-all duration-300`}
          style={{ width: `${conversion}%` }}
        />
      </div>
      <div className="text-sm whitespace-nowrap">
        <span className="font-semibold">{value.toLocaleString("ru-RU")}</span>
        <span className="text-muted-foreground ml-2">({conversion.toFixed(2)}%)</span>
      </div>
    </div>
  )

  // Summary box component
  const SummaryBox = ({ value, label, subtitle }) => (
    <div className="bg-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center h-full">
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground text-center">{label}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Date range display */}
      <div className="text-sm text-muted-foreground text-center mb-6">
        Период: {formatDate(startDate)} — {formatDate(endDate)}
      </div>

      {/* Table */}
      <div className="space-y-0">
        {/* Rows 1-2: Booking funnel (light red) */}
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-red-50 p-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Зарегистрировались на сайте</span>
          </div>
          <div className="flex items-center">
            <ProgressBar value={registration} conversion={(registration / total) * 100} bgColor="bg-red-400" />
          </div>
          <div className="row-span-2">
            <SummaryBox value={`${bookingAmount.toLocaleString("ru-RU")} ₽`} label="Сумма бронирований" />
          </div>
        </div>
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-red-50 p-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Забронировали на сайте</span>
          </div>
          <div className="flex items-center">
            <ProgressBar value={pay} conversion={(pay / registration) * 100} bgColor="bg-red-400" />
          </div>
        </div>

        {/* Rows 3-4: Whatsbetter traffic (light orange) */}
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-orange-50 p-4 mt-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Перешли в whatsbetter.me</span>
          </div>
          <div className="flex items-center">
            <ProgressBar value={openWhatsbetter} conversion={(openWhatsbetter / total) * 100} bgColor="bg-orange-400" />
          </div>
          <div className="row-span-2">
            <SummaryBox
              value={`${whatsbetterAmount.toLocaleString("ru-RU")} ₽`}
              label="Сумма бронирований в whatsbetter.me"
              subtitle="Комиссия 10%"
            />
          </div>
        </div>
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-orange-50 p-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Забронировали в whatsbetter.me</span>
          </div>
          <div className="flex items-center">
            <ProgressBar
              value={whatsbetterBooking}
              conversion={(whatsbetterBooking / total) * 100}
              bgColor="bg-orange-400"
            />
          </div>
        </div>

        {/* Rows 5-6: New users purchases (light green) */}
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-green-50 p-4 mt-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Новых пользователей whatsbetter.me</span>
          </div>
          <div className="flex items-center">
            <ProgressBar value={newUsers} conversion={(newUsers / total) * 100} bgColor="bg-green-400" />
          </div>
          <div className="row-span-2">
            <SummaryBox
              value={`${newClientsPurchasesAmount.toLocaleString("ru-RU")} ₽`}
              label="Покупки новых пользователей"
              subtitle="Комиссия 1%"
            />
          </div>
        </div>
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-green-50 p-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Новых покупателей whatsbetter.me</span>
          </div>
          <div className="flex items-center">
            <ProgressBar value={newClients} conversion={(newClients / total) * 100} bgColor="bg-green-400" />
          </div>
        </div>

        {/* Rows 7-8: All users purchases (light green) */}
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-green-50 p-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Пользователей whatsbetter.me</span>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <span className="font-semibold">{allClientsCount.toLocaleString("ru-RU")}</span>
            </div>
          </div>
          <div className="row-span-2">
            <SummaryBox
              value={`${allPurchasesAmount.toLocaleString("ru-RU")} ₽`}
              label="Покупки всех пользователей"
              subtitle="Комиссия 1%"
            />
          </div>
        </div>
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-green-50 p-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Покупателей whatsbetter.me</span>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <span className="font-semibold">{allClientsCount.toLocaleString("ru-RU")}</span>
            </div>
          </div>
        </div>

        {/* Rows 9-10: Total revenue (light green) */}
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-green-50 p-4">
          <div></div>
          <div></div>
          <div className="row-span-2">
            <SummaryBox value={`${totalRevenue.toLocaleString("ru-RU")} ₽`} label="Всего дополнительных доходов" />
          </div>
        </div>
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-green-50 p-4">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
