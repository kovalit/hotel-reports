import { useSelector } from "react-redux";

export function RevenueTable({ startDate, endDate }) {
  const { bookingFunnel, whatsbetter, newClientsPurchases, allPurchases } =
    useSelector((state) => state.revenue);

  if (!bookingFunnel || !whatsbetter || !newClientsPurchases || !allPurchases) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Загрузка данных...
      </div>
    );
  }

  // Calculate metrics
  const registration = bookingFunnel.registration || 0;
  const pay = bookingFunnel.pay || 0;
  const total = bookingFunnel.total || 1;
  const bookingAmount = bookingFunnel.amount || 0;

  const openWhatsbetter = whatsbetter.open_whatsbetter_me || 0;
  const whatsbetterBooking = whatsbetter.whatsbetter_me_booking || 0;
  const whatsbetterAmount = (whatsbetter.amount_price || 0) * 0.1;

  const newUsers = registration + whatsbetterBooking;
  const newClients = newClientsPurchases.clients_count || 0;
  const newClientsPurchasesAmount = (newClientsPurchases.amount_price || 0) * 0.01;

  const allUsersCount = bookingFunnel.total_registration + whatsbetter.whatsbetter_me_booking;
  const allClientsCount = allPurchases.clients_count;
  const allPurchasesAmount = (allPurchases.amount_price || 0) * 0.01;

  const totalRevenue = whatsbetterAmount + allPurchasesAmount;

  const overal = bookingAmount + totalRevenue;

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Progress bar component
  const ProgressBar = ({ value, conversion, bgColor }) => (
    <>
      <div
        className={`h-full ${bgColor} rounded-lg transition-all duration-300`}
        style={{ width: `calc(50px + ${conversion}%)` }}
      />
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden"></div>
        <div className="text-sm whitespace-nowrap">
          <span className="font-semibold">{value.toLocaleString("ru-RU")}</span>
          <span className="text-muted-foreground ml-2">
            ({conversion.toFixed(2)}%)
          </span>
        </div>
      </div>
    </>
  );

  // Summary box component
  const SummaryBox = ({ value, label, subtitle, bgColor = "bg-gray-104" }) => (
    <div className="flex gap-4 w-100">
      <div className={`${bgColor} rounded-2xl py-2 px-6 flex flex-col w-74`}>
        <div className="text-2xl font-bold mb-1">
          {value.toLocaleString("ru-RU")} ₽
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
        )}
      </div>

      <div
        className={`${bgColor} rounded-2xl py-2 px-6 flex items-center flex-col w-30 justify-center`}
      >
        <div className="text-lg ">{((value / overal) * 100).toFixed(1)} %</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Date range display */}
      <div className="text-lg mb-1">
        Количество визитов:{" "}
        <span className="font-bold">{total.toLocaleString("ru-RU")}</span>
      </div>

      <div className="text-sm text-muted-foreground mb-6">
        {formatDate(startDate)} — {formatDate(endDate)}
      </div>

      {/* Table */}
      <div className="space-y-0">
        {/* Rows 1-2: Booking funnel (light red) */}
        <div className="flex bg-red-100 py-2 px-6 mb-1 rounded-2xl">
          <div className="flex-1">
            <div className="flex-1 flex mb-2">
              <div className="flex items-center w-70 text-sm font-medium">
                Зарегистрировались на сайте
              </div>
              <div className="flex items-center flex-2">
                <ProgressBar
                  value={registration}
                  conversion={(registration / total) * 100}
                  bgColor="bg-red-400"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex items-center w-70 text-sm font-medium">
                Забронировали на сайте
              </div>
              <div className="flex items-center flex-2">
                <ProgressBar
                  value={pay}
                  conversion={(pay / total) * 100}
                  bgColor="bg-red-400"
                />
              </div>
            </div>
          </div>

          <div>
            <SummaryBox
              value={bookingAmount}
              label="Сумма бронирований"
              bgColor="bg-red-50"
            />

            <div className="flex gap-4 w-100 mt-2">
              <div
                className={`bg-red-50 rounded-2xl py-2 px-4 flex flex-col w-70`}
              >
                <div className="text-sm text-muted-foreground whitespace-pre">
                  Стоимость номеров:{" "}
                  <span className="font-bold ">
                    {bookingFunnel.amount_rooms.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre">
                  Стоимость услуг:{" "}
                  <span className="font-bold ">
                    {bookingFunnel.amount_services.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </div>

              <div
                className={`bg-red-50 rounded-2xl py-2 px-4 flex items-center flex-col w-30 justify-center`}
              >
                <div className="text-sm">
                  {((bookingFunnel.amount_rooms / overal) * 100).toFixed(1)} %
                </div>
                <div className="text-sm">
                  {((bookingFunnel.amount_services / overal) * 100).toFixed(1)}{" "}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rows 3-4: Whatsbetter traffic (light orange) */}
        <div className="flex bg-orange-100 py-2 px-6  mb-1 rounded-2xl">
          <div className="flex-1">
            <div className="flex-1 flex mb-2">
              <div className="flex items-center w-70 text-sm font-medium">
                Перешли в whatsbetter.me
              </div>
              <div className="flex items-center flex-2">
                <ProgressBar
                  value={openWhatsbetter}
                  conversion={(openWhatsbetter / total) * 100}
                  bgColor="bg-orange-400"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex items-center w-70 text-sm font-medium">
                Забронировали в whatsbetter.me
              </div>
              <div className="flex items-center flex-2">
                <ProgressBar
                  value={whatsbetterBooking}
                  conversion={(whatsbetterBooking / total) * 100}
                  bgColor="bg-orange-400"
                />
              </div>
            </div>
          </div>

          <SummaryBox
            value={whatsbetterAmount}
            label="Вознаграждение"
            subtitle="Комиссия 10%"
            bgColor="bg-orange-50"
          />
        </div>

        {/* Rows 5-6: New users purchases (light green) */}
        <div className="flex bg-green-100 py-2 px-6  mb-1 rounded-2xl">
          <div className="flex-1">
            <div className="flex-1 flex mb-2">
              <div className="flex items-center w-70 text-sm font-medium">
                Новых пользователей whatsbetter.me
              </div>
              <div className="flex items-center flex-2">
                <ProgressBar
                  value={newUsers}
                  conversion={(newUsers / total) * 100}
                  bgColor="bg-green-400"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex items-center w-70 text-sm font-medium">
                Новых покупателей whatsbetter.me
              </div>
              <div className="flex items-center flex-2">
                <ProgressBar
                  value={newClients}
                  conversion={(newClients / total) * 100}
                  bgColor="bg-green-400"
                />
              </div>
            </div>
          </div>

          <SummaryBox
            value={newClientsPurchasesAmount}
            label="Покупки новых пользователей"
            subtitle="Комиссия 1%"
            bgColor="bg-green-50"
          />
        </div>

        {/* Rows 7-8: All users purchases (light green) */}
        <div className="flex bg-green-100 py-2 px-6  mb-1 rounded-2xl">
          <div className="flex-1">
            <div className="flex-1 flex mb-2">
              <div className="flex items-center w-70 text-sm font-medium">
                Пользователей whatsbetter.me
              </div>
              <div className="flex items-center flex-2">
                <div className="text-sm">
                  <span className="font-semibold">
                    {allUsersCount.toLocaleString("ru-RU")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="flex items-center w-70 text-sm font-medium">
                Покупателей whatsbetter.me
              </div>
              <div className="flex items-center flex-2">
                <div className="text-sm">
                  <span className="font-semibold">
                    {allClientsCount.toLocaleString("ru-RU")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <SummaryBox
            value={allPurchasesAmount}
            label="Покупки всех пользователей"
            subtitle="Комиссия 1%"
            bgColor="bg-green-50"
          />
        </div>

        {/* Rows 9-10: Total revenue (light green) */}
        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 bg-sky-100 py-2 px-6 rounded-2xl">
          <div></div>
          <div></div>
          <div className="row-span-2">
            <SummaryBox
              value={totalRevenue}
              label="Всего дополнительных доходов"
              bgColor="bg-sky-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_4fr_2fr] gap-4 py-2 px-6 rounded-2xl">
          <div></div>
          <div></div>
          <div className="row-span-2">
            <SummaryBox
              value={overal}
              label="Всего доходов"
              bgColor="bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
