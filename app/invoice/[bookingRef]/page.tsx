export default async function InvoicePage({
    params,
}: {
    params: Promise<{ bookingRef: string }>;
}) {
    const { bookingRef } = await params;

    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(
        `${baseUrl}/api/bookings/${bookingRef}`,
        {
            cache: "no-store",
        }
    );

    const data = await response.json();

    if (!data.success) {
        return (
            <main className="min-h-screen bg-gray-50 p-8">
                <div className="mx-auto max-w-2xl bg-white border rounded-xl shadow p-8">
                    <h1 className="text-3xl font-bold mb-2">Booking not found</h1>
                    <p className="text-gray-600">
                        Please check your booking reference and try again.
                    </p>
                </div>
            </main>
        );
    }

    const { booking, schedule } = data;

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-3xl bg-white border rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-black text-white p-8">
                    <p className="text-sm uppercase tracking-widest text-gray-300">
                        Booking Confirmation
                    </p>
                    <h1 className="text-4xl font-bold mt-2">Dairy Flat Airlines</h1>
                    <p className="mt-2 text-gray-300">
                        Thank you for booking with us.
                    </p>
                </div>

                <div className="p-8">
                    <div className="mb-8 rounded-xl bg-gray-100 p-5">
                        <p className="text-sm text-gray-600">Booking Reference</p>
                        <p className="text-3xl font-bold tracking-wide">
                            {booking.bookingRef}
                        </p>
                        <p className="mt-2">
                            Status:{" "}
                            <span
                                className={
                                    booking.status === "confirmed"
                                        ? "font-semibold text-green-700"
                                        : "font-semibold text-red-600"
                                }
                            >
                                {booking.status}
                            </span>
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">
                                Passenger Details
                            </h2>

                            <p>
                                <strong>Name:</strong> {booking.passengerName}
                            </p>
                            <p>
                                <strong>Email:</strong> {booking.email}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">
                                Flight Details
                            </h2>

                            <p>
                                <strong>Flight:</strong> {schedule.flightNo}
                            </p>
                            <p>
                                <strong>Aircraft:</strong> {schedule.aircraft}
                            </p>
                            <p>
                                <strong>Route:</strong> {schedule.origin} →{" "}
                                {schedule.destination}
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border p-5">
                            <p className="text-sm text-gray-600">Departure</p>
                            <p className="text-lg font-semibold">
                                {new Date(schedule.departureTime).toLocaleString()}
                            </p>
                        </div>

                        <div className="rounded-xl border p-5">
                            <p className="text-sm text-gray-600">Arrival</p>
                            <p className="text-lg font-semibold">
                                {new Date(schedule.arrivalTime).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-6 flex items-center justify-between">
                        <p className="text-xl font-semibold">Total Price</p>
                        <p className="text-3xl font-bold">${schedule.price}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}