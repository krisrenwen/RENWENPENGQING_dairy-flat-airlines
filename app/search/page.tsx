"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const airports = [
    { code: "NZNE", city: "Auckland" },
    { code: "YSSY", city: "Sydney" },
    { code: "NZRO", city: "Rotorua" },
    { code: "NZGB", city: "Great Barrier Island" },
    { code: "NZCI", city: "Chatham Islands" },
    { code: "NZTL", city: "Lake Tekapo" },
];

const validRoutes: Record<string, string[]> = {
    NZNE: ["YSSY", "NZRO", "NZGB", "NZCI", "NZTL"],
    YSSY: ["NZNE"],
    NZRO: ["NZNE"],
    NZGB: ["NZNE"],
    NZCI: ["NZNE"],
    NZTL: ["NZNE"],
};

function addOneDay(dateString: string) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
}

function getAirportLabel(code: string) {
    const airport = airports.find((item) => item.code === code);
    return airport ? `${airport.code} — ${airport.city}` : code;
}

export default function SearchPage() {
    const [tripType, setTripType] = useState<"one-way" | "return">("one-way");

    const [origin, setOrigin] = useState("NZNE");
    const [destination, setDestination] = useState("YSSY");

    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");

    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableReturnDates, setAvailableReturnDates] = useState<string[]>([]);

    const [outboundFlights, setOutboundFlights] = useState<any[]>([]);
    const [returnFlights, setReturnFlights] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const availableDestinations = airports.filter((airport) =>
        validRoutes[origin]?.includes(airport.code)
    );

    function resetSearchResults() {
        setDepartureDate("");
        setReturnDate("");
        setOutboundFlights([]);
        setReturnFlights([]);
        setHasSearched(false);
    }

    useEffect(() => {
        async function fetchDates() {
            const response = await fetch(
                `/api/available-dates?orig=${origin}&dest=${destination}`
            );

            const data = await response.json();
            setAvailableDates(data.dates || []);
        }

        fetchDates();
    }, [origin, destination]);

    useEffect(() => {
        async function fetchReturnDates() {
            if (tripType !== "return") {
                setAvailableReturnDates([]);
                return;
            }

            const response = await fetch(
                `/api/available-dates?orig=${destination}&dest=${origin}`
            );

            const data = await response.json();
            setAvailableReturnDates(data.dates || []);
        }

        fetchReturnDates();
    }, [tripType, origin, destination]);

    async function handleSearch() {
        setLoading(true);
        setHasSearched(true);

        let outboundUrl = `/api/schedules?orig=${origin}&dest=${destination}`;

        if (departureDate) {
            outboundUrl += `&date1=${departureDate}&date2=${addOneDay(
                departureDate
            )}`;
        }

        const outboundResponse = await fetch(outboundUrl);
        const outboundData = await outboundResponse.json();
        setOutboundFlights(outboundData.schedules || []);

        if (tripType === "return") {
            let returnUrl = `/api/schedules?orig=${destination}&dest=${origin}`;

            if (returnDate) {
                returnUrl += `&date1=${returnDate}&date2=${addOneDay(returnDate)}`;
            }

            const returnResponse = await fetch(returnUrl);
            const returnData = await returnResponse.json();
            setReturnFlights(returnData.schedules || []);
        } else {
            setReturnFlights([]);
        }

        setLoading(false);
    }

    function FlightCard({ schedule }: { schedule: any }) {
        const isFull = schedule.seatsLeft <= 0;

        return (
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="mb-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                                {schedule.aircraft}
                            </div>

                            <h3 className="text-3xl font-bold text-gray-950">
                                {schedule.origin} → {schedule.destination}
                            </h3>

                            <p className="mt-2 text-gray-500">Flight {schedule.flightNo}</p>
                        </div>

                        <div className="md:text-right">
                            <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                                From
                            </p>

                            <p className="text-4xl font-black text-gray-950">
                                ${schedule.price}
                            </p>

                            <p
                                className={`mt-2 font-semibold ${isFull ? "text-red-600" : "text-green-700"
                                    }`}
                            >
                                {isFull ? "Full" : `${schedule.seatsLeft} seats left`}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                Departure
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                {new Date(schedule.departureTime).toLocaleString()}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                Arrival
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                {new Date(schedule.arrivalTime).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
                    <p className="text-sm text-gray-500">
                        Capacity {schedule.capacity} passengers
                    </p>

                    {isFull ? (
                        <button
                            disabled
                            className="rounded-full bg-gray-300 px-5 py-3 font-semibold text-white"
                        >
                            Flight full
                        </button>
                    ) : (
                        <Link
                            href={`/booking/${schedule._id}`}
                            className="rounded-full bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
                        >
                            Book flight
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <section className="bg-gradient-to-br from-black via-gray-900 to-gray-700 px-8 py-20 text-white">
                <div className="mx-auto max-w-6xl">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-gray-300">
                        Dairy Flat Airlines
                    </p>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
                        Find your next regional flight.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                        Select a valid route, choose from available flight dates, and book a
                        scheduled regional service.
                    </p>
                </div>
            </section>

            <section className="mx-auto -mt-12 max-w-6xl px-8 pb-16">
                <div className="rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-2xl backdrop-blur">
                    <div className="mb-6 flex flex-wrap gap-3">
                        <button
                            onClick={() => {
                                setTripType("one-way");
                                setReturnFlights([]);
                            }}
                            className={`rounded-full px-5 py-3 font-semibold transition ${tripType === "one-way"
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            One-way
                        </button>

                        <button
                            onClick={() => setTripType("return")}
                            className={`rounded-full px-5 py-3 font-semibold transition ${tripType === "return"
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Return trip
                        </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                                Origin
                            </label>

                            <select
                                value={origin}
                                onChange={(e) => {
                                    const newOrigin = e.target.value;
                                    const firstValidDestination = validRoutes[newOrigin][0];

                                    setOrigin(newOrigin);
                                    setDestination(firstValidDestination);
                                    resetSearchResults();
                                }}
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-lg font-semibold shadow-sm"
                            >
                                {airports.map((airport) => (
                                    <option key={airport.code} value={airport.code}>
                                        {airport.code} — {airport.city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                                Destination
                            </label>

                            <select
                                value={destination}
                                onChange={(e) => {
                                    setDestination(e.target.value);
                                    resetSearchResults();
                                }}
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-lg font-semibold shadow-sm"
                            >
                                {availableDestinations.map((airport) => (
                                    <option key={airport.code} value={airport.code}>
                                        {airport.code} — {airport.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 rounded-3xl bg-gray-50 p-5">
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                            Available departure dates
                        </h3>

                        <p className="mb-4 text-sm text-gray-500">
                            {getAirportLabel(origin)} → {getAirportLabel(destination)}
                        </p>

                        {availableDates.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No scheduled departure dates for this route.
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {availableDates.map((date) => (
                                    <button
                                        key={date}
                                        onClick={() => setDepartureDate(date)}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${departureDate === date
                                                ? "bg-black text-white"
                                                : "bg-white text-gray-700 shadow-sm hover:bg-gray-200"
                                            }`}
                                    >
                                        {date}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {tripType === "return" && (
                        <div className="mt-6 rounded-3xl bg-gray-50 p-5">
                            <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                                Available return dates
                            </h3>

                            <p className="mb-4 text-sm text-gray-500">
                                {getAirportLabel(destination)} → {getAirportLabel(origin)}
                            </p>

                            {availableReturnDates.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No scheduled return dates for this route.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {availableReturnDates.map((date) => (
                                        <button
                                            key={date}
                                            onClick={() => setReturnDate(date)}
                                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${returnDate === date
                                                    ? "bg-black text-white"
                                                    : "bg-white text-gray-700 shadow-sm hover:bg-gray-200"
                                                }`}
                                        >
                                            {date}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="mt-8 w-full rounded-2xl bg-black py-5 text-lg font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {loading ? "Searching flights..." : "Search flights"}
                    </button>
                </div>

                {hasSearched && (
                    <div className="mt-12 space-y-14">
                        <section>
                            <div className="mb-5 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                        Results
                                    </p>

                                    <h2 className="text-3xl font-black text-gray-950">
                                        Outbound Flights
                                    </h2>
                                </div>

                                <p className="text-gray-500">
                                    {outboundFlights.length} flights found
                                </p>
                            </div>

                            {!loading && outboundFlights.length === 0 ? (
                                <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-900">
                                    No outbound flights found. Select one of the available dates
                                    above, or search without choosing a date.
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {outboundFlights.map((schedule) => (
                                        <FlightCard key={schedule._id} schedule={schedule} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {tripType === "return" && (
                            <section>
                                <div className="mb-5 flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                            Results
                                        </p>

                                        <h2 className="text-3xl font-black text-gray-950">
                                            Return Flights
                                        </h2>
                                    </div>

                                    <p className="text-gray-500">
                                        {returnFlights.length} flights found
                                    </p>
                                </div>

                                {!loading && returnFlights.length === 0 ? (
                                    <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-900">
                                        No return flights found. Select one of the available return
                                        dates above, or search without choosing a return date.
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {returnFlights.map((schedule) => (
                                            <FlightCard key={schedule._id} schedule={schedule} />
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}