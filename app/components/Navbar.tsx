import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-black px-4 py-4 text-white md:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Link
                    href="/"
                    className="text-2xl font-bold leading-tight"
                >
                    Dairy Flat Airlines
                </Link>

                <div className="flex flex-wrap gap-4 text-sm md:gap-6 md:text-base">
                    <Link
                        href="/search"
                        className="transition hover:text-gray-300"
                    >
                        Search Flights
                    </Link>

                    <Link
                        href="/my-flights"
                        className="transition hover:text-gray-300"
                    >
                        My Flights
                    </Link>

                    <Link
                        href="/cancel"
                        className="transition hover:text-gray-300"
                    >
                        Cancel Booking
                    </Link>
                </div>
            </div>
        </nav>
    );
}