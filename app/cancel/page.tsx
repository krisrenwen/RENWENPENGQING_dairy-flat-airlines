"use client";

import { useState } from "react";

export default function CancelPage() {
    const [bookingRef, setBookingRef] =
        useState("");

    async function handleCancel() {
        if (!bookingRef) {
            alert("Please enter a booking reference.");
            return;
        }

        const response = await fetch(
            "/api/bookings/cancel",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookingRef,
                }),
            }
        );

        const data = await response.json();

        alert(data.message);
    }

    return (
        <main className="p-8">
            <div className="max-w-xl border rounded p-6 shadow">
                <h1 className="text-3xl font-bold mb-6">
                    Cancel Booking
                </h1>

                <input
                    type="text"
                    placeholder="Booking Reference"
                    value={bookingRef}
                    onChange={(e) =>
                        setBookingRef(e.target.value)
                    }
                    className="w-full border p-2 rounded mb-4"
                />

                <button
                    onClick={handleCancel}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    Cancel Booking
                </button>
            </div>
        </main>
    );
}