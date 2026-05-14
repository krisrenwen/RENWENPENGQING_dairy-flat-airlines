"use client";

import { useState } from "react";

export default function MyFlightsPage() {
    const [email, setEmail] = useState("");

    const [flights, setFlights] = useState<any[]>([]);

    async function handleSearch() {
        if (!email) {
            alert("Please enter an email.");
            return;
        }

        const response = await fetch(
            `/api/passenger-flights?email=${email}`
        );

        const data = await response.json();

        setFlights(data.flights || []);
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">
                My Flights
            </h1>

            <div className="flex gap-4 mb-6">
                <input
                    type="email"
                    placeholder="Passenger Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="border p-2 rounded w-80"
                />

                <button
                    onClick={handleSearch}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>

            <div className="space-y-4">
                {flights.map((flight) => (
                    <div
                        key={flight.bookingRef}
                        className="border rounded p-4 shadow"
                    >
                        <h2 className="text-xl font-semibold">
                            {flight.flightNo}
                        </h2>

                        <p>
                            {flight.origin} →{" "}
                            {flight.destination}
                        </p>

                        <p>
                            Departure:{" "}
                            {new Date(
                                flight.departureTime
                            ).toLocaleString()}
                        </p>

                        <p>
                            Arrival:{" "}
                            {new Date(
                                flight.arrivalTime
                            ).toLocaleString()}
                        </p>

                        <p>Status: {flight.status}</p>

                        <p>
                            Booking Reference:{" "}
                            {flight.bookingRef}
                        </p>

                        <p>Aircraft: {flight.aircraft}</p>

                        <p>Price: ${flight.price}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}