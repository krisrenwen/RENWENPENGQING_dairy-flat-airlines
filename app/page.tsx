import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-6">
          Dairy Flat Airlines
        </h1>

        <p className="text-lg text-gray-600 mb-10">
          Boutique regional airline booking system
          built with Next.js and MongoDB.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/search"
            className="bg-black text-white px-6 py-4 rounded text-lg"
          >
            Search Flights
          </Link>

          <Link
            href="/my-flights"
            className="bg-blue-600 text-white px-6 py-4 rounded text-lg"
          >
            My Flights
          </Link>

          <Link
            href="/cancel"
            className="bg-red-600 text-white px-6 py-4 rounded text-lg"
          >
            Cancel Booking
          </Link>
        </div>
      </div>
    </main>
  );
}