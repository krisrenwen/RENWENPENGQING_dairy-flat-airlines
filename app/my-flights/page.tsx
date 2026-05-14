"use client";

import { useState } from "react";
import Link from "next/link";

export default function MyFlightsPage() {
    const [email, setEmail] = useState("");
    const [flights, setFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    async function handleSearch() {
        if (!email) {
            alert("Please enter an email.");
            return;
        }

        setLoading(true);
        setHasSearched(true);

        const response = await fetch(`/api/passenger-flights?email=${email}`);
        const data = await response.json();

        setFlights(data.flights || []);
        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <section className="bg-gradient-to-br from-black via-gray-900 to-gray-700 px-8 py-20 text-white">
                <div className="mx-auto max-w-6xl">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-gray-300">
                        Passenger Trips
                    </p>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
                        Find your booked flights.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                        Enter the passenger email used when booking to view all matching
                        flight reservations.
                    </p>
                </div>
            </section>

            <section className="mx-auto -mt-12 max-w-5xl px-8 pb-16">
                <div className="rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-2xl backdrop-blur">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                        Passenger Email
                    </label>

                    <div className="flex flex-col gap-4 md:flex-row">
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-4 text-lg shadow-sm outline-none transition focus:border-black focus:ring-4 focus:ring-black/10"
                        />

                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="rounded-2xl bg-black px-8 py-4 text-lg font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                {!hasSearched && (
                    <div className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6 text-blue-900">
                        Try the email used during booking, for example{" "}
                        <strong>john@example.com</strong>.
                    </div>
                )}

                {hasSearched && (
                    <section className="mt-12">
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                    Results
                                </p>
                                <h2 className="text-3xl font-black text-gray-950">
                                    Your Flights
                                </h2>
                            </div>

                            <p className="text-gray-500">{flights.length} bookings found</p>
                        </div>

                        {flights.length === 0 ? (
                            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-900">
                                No flights found for this email. Check the email address and try
                                again.
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {flights.map((flight) => (
                                    <div
                                        key={flight.bookingRef}
                                        className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                                <div>
                                                    <div
                                                        className={`mb-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${flight.status === "confirmed"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {flight.status}
                                                    </div>

                                                    <h3 className="text-3xl font-bold text-gray-950">
                                                        {flight.origin} → {flight.destination}
                                                    </h3>

                                                    <p className="mt-2 text-gray-500">
                                                        Flight {flight.flightNo}
                                                    </p>
                                                </div>

                                                <div className="md:text-right">
                                                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                                                        Booking Ref
                                                    </p>
                                                    <p className="text-2xl font-black text-gray-950">
                                                        {flight.bookingRef}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-8 grid gap-4 md:grid-cols-2">
                                                <div className="rounded-2xl bg-gray-50 p-4">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                                        Departure
                                                    </p>
                                                    <p className="mt-1 text-lg font-semibold">
                                                        {new Date(flight.departureTime).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl bg-gray-50 p-4">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                                        Arrival
                                                    </p>
                                                    <p className="mt-1 text-lg font-semibold">
                                                        {new Date(flight.arrivalTime).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
                                            <p className="text-sm text-gray-500">
                                                {flight.aircraft} · ${flight.price}
                                            </p>

                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/invoice/${flight.bookingRef}`}
                                                    className="rounded-full bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
                                                >
                                                    View invoice
                                                </Link>

                                                {flight.status === "confirmed" && (
                                                    <Link
                                                        href={`/cancel?ref=${flight.bookingRef}`}
                                                        className="rounded-full border border-red-500 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                                                    >
                                                        Cancel booking
                                                    </Link>
                                                )}
                                            </div>


                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </section>
        </main>
    );
}