import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-black text-white px-8 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl font-bold"
                >
                    Dairy Flat Airlines
                </Link>

                <div className="flex gap-6">
                    <Link
                        href="/search"
                        className="hover:text-gray-300"
                    >
                        Search Flights
                    </Link>

                    <Link
                        href="/my-flights"
                        className="hover:text-gray-300"
                    >
                        My Flights
                    </Link>

                    <Link
                        href="/cancel"
                        className="hover:text-gray-300"
                    >
                        Cancel Booking
                    </Link>
                </div>
            </div>
        </nav>
    );
}