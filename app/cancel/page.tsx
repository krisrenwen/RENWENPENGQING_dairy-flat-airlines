"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CancelPage() {
    const searchParams = useSearchParams();

    const initialRef = searchParams.get("ref") || "";

    const [bookingRef, setBookingRef] =
        useState(initialRef);

    const [message, setMessage] =
        useState("");

    const [success, setSuccess] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);

    useEffect(() => {
        setBookingRef(initialRef);
    }, [initialRef]);

    async function confirmCancellation() {
        if (!bookingRef) {
            setSuccess(false);

            setMessage(
                "Please enter a booking reference."
            );

            return;
        }

        setShowConfirm(true);
    }

    async function handleCancel() {
        try {
            setLoading(true);

            const response = await fetch(
                "/api/bookings/cancel",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        bookingRef,
                    }),
                }
            );

            const data =
                await response.json();

            setSuccess(data.success);

            setMessage(data.message);

            setShowConfirm(false);
        } catch (error) {
            console.error(error);

            setSuccess(false);

            setMessage(
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <section className="bg-gradient-to-br from-red-950 via-red-900 to-black px-8 py-20 text-white">
                <div className="mx-auto max-w-5xl">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-red-300">
                        Booking Management
                    </p>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
                        Cancel your booking.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-red-100">
                        Enter your booking reference to
                        cancel a confirmed flight
                        reservation.
                    </p>
                </div>
            </section>

            <section className="mx-auto -mt-12 max-w-3xl px-8 pb-16">
                <div className="rounded-[2rem] border border-white/70 bg-white/95 p-8 shadow-2xl backdrop-blur">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                        Booking Reference
                    </label>

                    <input
                        type="text"
                        placeholder="BKXXXXXX"
                        value={bookingRef}
                        onChange={(e) =>
                            setBookingRef(
                                e.target.value
                            )
                        }
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-lg font-semibold shadow-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />

                    <button
                        onClick={confirmCancellation}
                        disabled={loading}
                        className="mt-6 w-full rounded-2xl bg-red-600 py-5 text-lg font-bold text-white transition hover:bg-red-700 disabled:bg-gray-400"
                    >
                        {loading
                            ? "Cancelling booking..."
                            : "Cancel booking"}
                    </button>


                    {showConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
                                <div className="mb-6">
                                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                                        Confirm Cancellation
                                    </p>

                                    <h2 className="text-3xl font-black text-gray-950">
                                        Are you sure?
                                    </h2>

                                    <p className="mt-4 text-gray-600 leading-relaxed">
                                        This booking will be cancelled and
                                        cannot be restored later.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                        Booking Reference
                                    </p>

                                    <p className="mt-1 text-xl font-black text-gray-950">
                                        {bookingRef}
                                    </p>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button
                                        onClick={() =>
                                            setShowConfirm(false)
                                        }
                                        className="flex-1 rounded-2xl border border-gray-300 py-4 font-semibold text-gray-700 transition hover:bg-gray-100"
                                    >
                                        Keep Booking
                                    </button>

                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="flex-1 rounded-2xl bg-red-600 py-4 font-bold text-white transition hover:bg-red-700 disabled:bg-gray-400"
                                    >
                                        {loading
                                            ? "Cancelling..."
                                            : "Yes, Cancel"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div
                            className={`mt-6 rounded-3xl border p-5 ${success
                                ? "border-green-200 bg-green-50 text-green-800"
                                : "border-red-200 bg-red-50 text-red-800"
                                }`}
                        >
                            <p className="text-lg font-semibold">
                                {message}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}