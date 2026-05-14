"use client";

import { useEffect, useState } from "react";

export default function BookingForm({
    scheduleId,
}: {
    scheduleId: string;
}) {
    const [schedule, setSchedule] =
        useState<any>(null);

    const [passengerName, setPassengerName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [bookingLoading, setBookingLoading] =
        useState(false);

    useEffect(() => {
        async function fetchSchedule() {
            const response = await fetch(
                `/api/schedules/${scheduleId}`
            );

            const data =
                await response.json();

            if (data.success) {
                setSchedule(data.schedule);
            }

            setLoading(false);
        }

        fetchSchedule();
    }, [scheduleId]);

    async function handleBooking() {
        if (!passengerName || !email) {
            alert(
                "Please enter passenger name and email."
            );

            return;
        }

        try {
            setBookingLoading(true);

            const response = await fetch(
                "/api/bookings",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        scheduleId,
                        passengerName,
                        email,
                    }),
                }
            );

            const data =
                await response.json();

            if (!data.success) {
                alert(
                    data.message ||
                    "Booking failed."
                );

                return;
            }

            window.location.href =
                `/invoice/${data.bookingRef}`;
        } catch (error) {
            console.error(error);

            alert(
                "Something went wrong."
            );
        } finally {
            setBookingLoading(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-100 p-8">
                <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-sm">
                    <p className="text-lg text-gray-500">
                        Loading flight details...
                    </p>
                </div>
            </main>
        );
    }

    if (!schedule) {
        return (
            <main className="min-h-screen bg-gray-100 p-8">
                <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-sm">
                    <p className="text-lg text-red-600">
                        Flight not found.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 px-8 py-12">
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* LEFT SIDE */}
                    <div className="overflow-hidden rounded-[2rem] bg-black text-white shadow-2xl">
                        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
                            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-gray-400">
                                Flight Booking
                            </p>

                            <h1 className="text-5xl font-black">
                                {schedule.origin} →{" "}
                                {schedule.destination}
                            </h1>

                            <p className="mt-4 text-lg text-gray-300">
                                Flight {schedule.flightNo}
                            </p>

                            <div className="mt-10 space-y-5">
                                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        Departure
                                    </p>

                                    <p className="mt-2 text-xl font-semibold">
                                        {new Date(
                                            schedule.departureTime
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        Arrival
                                    </p>

                                    <p className="mt-2 text-xl font-semibold">
                                        {new Date(
                                            schedule.arrivalTime
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl bg-white/10 p-5">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            Aircraft
                                        </p>

                                        <p className="mt-2 text-lg font-semibold">
                                            {schedule.aircraft}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-white/10 p-5">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            Seats Left
                                        </p>

                                        <p className="mt-2 text-lg font-semibold">
                                            {schedule.seatsLeft}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 px-8 py-6">
                            <div>
                                <p className="text-sm uppercase tracking-widest text-gray-400">
                                    Total Fare
                                </p>

                                <p className="text-4xl font-black">
                                    ${schedule.price}
                                </p>
                            </div>

                            <div className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black">
                                DFA
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="rounded-[2rem] bg-white p-8 shadow-xl">
                        <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-gray-400">
                            Passenger Details
                        </p>

                        <h2 className="text-4xl font-black text-gray-950">
                            Complete your booking.
                        </h2>

                        <p className="mt-4 leading-relaxed text-gray-500">
                            Enter the passenger information
                            below to confirm your flight
                            reservation.
                        </p>

                        <div className="mt-10 space-y-6">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Passenger Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="John Smith"
                                    value={passengerName}
                                    onChange={(e) =>
                                        setPassengerName(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-lg shadow-sm outline-none transition focus:border-black focus:ring-4 focus:ring-black/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-lg shadow-sm outline-none transition focus:border-black focus:ring-4 focus:ring-black/10"
                                />
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={bookingLoading}
                                className="w-full rounded-2xl bg-black py-5 text-lg font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                            >
                                {bookingLoading
                                    ? "Confirming booking..."
                                    : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}