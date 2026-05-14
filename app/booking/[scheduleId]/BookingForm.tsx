"use client";

import { useEffect, useState } from "react";

export default function BookingForm({
    scheduleId,
}: {
    scheduleId: string;
}) {
    const [schedule, setSchedule] = useState<any>(null);
    const [passengerName, setPassengerName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchedule() {
            const response = await fetch(`/api/schedules/${scheduleId}`);
            const data = await response.json();

            if (data.success) {
                setSchedule(data.schedule);
            }

            setLoading(false);
        }

        fetchSchedule();
    }, [scheduleId]);

    async function handleBooking() {
        if (!passengerName || !email) {
            alert("Please enter passenger name and email.");
            return;
        }

        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                scheduleId,
                passengerName,
                email,
            }),
        });

        const data = await response.json();

        if (!data.success) {
            alert(data.message || "Booking failed.");
            return;
        }

        window.location.href = `/invoice/${data.bookingRef}`;
    }

    if (loading) {
        return <p>Loading flight details...</p>;
    }

    if (!schedule) {
        return <p>Flight not found.</p>;
    }

    return (
        <div className="max-w-2xl border rounded p-6 shadow">
            <h2 className="text-2xl font-semibold mb-4">
                {schedule.flightNo}: {schedule.origin} → {schedule.destination}
            </h2>

            <p>Departure: {new Date(schedule.departureTime).toLocaleString()}</p>
            <p>Arrival: {new Date(schedule.arrivalTime).toLocaleString()}</p>
            <p>Aircraft: {schedule.aircraft}</p>
            <p>Price: ${schedule.price}</p>
            <p>Seats Left: {schedule.seatsLeft}</p>

            <div className="mt-6 space-y-4">
                <input
                    type="text"
                    placeholder="Passenger name"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="block w-full border p-2 rounded"
                />

                <input
                    type="email"
                    placeholder="Passenger email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full border p-2 rounded"
                />

                <button
                    onClick={handleBooking}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
}