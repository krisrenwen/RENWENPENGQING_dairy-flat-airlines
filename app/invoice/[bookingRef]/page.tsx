import client from "@/lib/mongodb";

export default async function InvoicePage({
    params,
}: {
    params: Promise<{ bookingRef: string }>;
}) {
    const { bookingRef } = await params;

    await client.connect();

    const db = client.db("airline-booking");

    const schedule = await db.collection("schedules").findOne({
        "bookings.bookingRef": bookingRef,
    });

    if (!schedule) {
        return (
            <main className="min-h-screen bg-gray-50 p-8">
                <div className="mx-auto max-w-2xl rounded-xl border bg-white p-8 shadow">
                    <h1 className="text-3xl font-bold">Booking not found</h1>
                    <p className="mt-2 text-gray-600">
                        Please check your booking reference and try again.
                    </p>
                </div>
            </main>
        );
    }

    const booking = schedule.bookings.find(
        (item: any) => item.bookingRef === bookingRef
    );

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white shadow-lg">
                <div className="bg-black p-8 text-white">
                    <p className="text-sm uppercase tracking-widest text-gray-300">
                        Booking Confirmation
                    </p>
                    <h1 className="mt-2 text-4xl font-bold">Dairy Flat Airlines</h1>
                    <p className="mt-2 text-gray-300">Thank you for booking with us.</p>
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
                            <h2 className="mb-3 text-xl font-semibold">
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
                            <h2 className="mb-3 text-xl font-semibold">Flight Details</h2>
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

                    <div className="mt-8 flex items-center justify-between border-t pt-6">
                        <p className="text-xl font-semibold">Total Price</p>
                        <p className="text-3xl font-bold">${schedule.price}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}