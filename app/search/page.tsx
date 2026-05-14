"use client";

import { useState } from "react";
import Link from "next/link";

const airports = [
    { code: "NZNE", name: "Dairy Flat" },
    { code: "YSSY", name: "Sydney" },
    { code: "NZRO", name: "Rotorua" },
    { code: "NZGB", name: "Great Barrier Island" },
    { code: "NZCI", name: "Chatham Islands" },
    { code: "NZTL", name: "Lake Tekapo" },
];

export default function SearchPage() {
    const [origin, setOrigin] = useState("NZNE");
    const [destination, setDestination] = useState("YSSY");
    const [date1, setDate1] = useState("2026-06-01");
    const [date2, setDate2] = useState("2026-07-31");
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    async function handleSearch() {
        if (origin === destination) {
            alert("Origin and destination cannot be the same.");
            return;
        }

        setLoading(true);

        const response = await fetch(
            `/api/schedules?orig=${origin}&dest=${destination}&date1=${date1}&date2=${date2}`
        );

        const data = await response.json();

        setSchedules(data.schedules || []);
        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-4xl font-bold mb-2">Search Flights</h1>
                <p className="text-gray-600 mb-8">
                    Choose your route and date range to find available scheduled flights.
                </p>

                <div className="bg-white border rounded-xl shadow p-6 mb-8 grid gap-4 md:grid-cols-5">
                    <select
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="border p-3 rounded"
                    >
                        {airports.map((airport) => (
                            <option key={airport.code} value={airport.code}>
                                {airport.code} - {airport.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="border p-3 rounded"
                    >
                        {airports.map((airport) => (
                            <option key={airport.code} value={airport.code}>
                                {airport.code} - {airport.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={date1}
                        onChange={(e) => setDate1(e.target.value)}
                        className="border p-3 rounded"
                    />

                    <input
                        type="date"
                        value={date2}
                        onChange={(e) => setDate2(e.target.value)}
                        className="border p-3 rounded"
                    />

                    <button
                        onClick={handleSearch}
                        className="bg-black text-white px-4 py-3 rounded"
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {!loading && schedules.length === 0 && (
                    <p className="text-gray-600">
                        No flights shown yet. Try searching NZNE to YSSY between June and July 2026.
                    </p>
                )}

                <div className="grid gap-4">
                    {schedules.map((schedule) => (
                        <div
                            key={schedule._id}
                            className="bg-white border rounded-xl shadow p-6"
                        >
                            <div className="flex justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold">
                                        {schedule.flightNo}
                                    </h2>
                                    <p className="text-gray-600">
                                        {schedule.origin} → {schedule.destination}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl font-bold">${schedule.price}</p>
                                    <p className={schedule.seatsLeft > 0 ? "text-green-700" : "text-red-600"}>
                                        {schedule.seatsLeft > 0
                                            ? `${schedule.seatsLeft} seats left`
                                            : "Full"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-2 md:grid-cols-2 text-sm">
                                <p>
                                    <strong>Departure:</strong>{" "}
                                    {new Date(schedule.departureTime).toLocaleString()}
                                </p>

                                <p>
                                    <strong>Arrival:</strong>{" "}
                                    {new Date(schedule.arrivalTime).toLocaleString()}
                                </p>

                                <p>
                                    <strong>Aircraft:</strong> {schedule.aircraft}
                                </p>

                                <p>
                                    <strong>Capacity:</strong> {schedule.capacity}
                                </p>
                            </div>

                            {schedule.seatsLeft > 0 ? (
                                <Link
                                    href={`/booking/${schedule._id}`}
                                    className="inline-block mt-5 bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Book this flight
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="inline-block mt-5 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                                >
                                    Flight full
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}