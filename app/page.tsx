import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-8 py-28">
          <p className="uppercase tracking-[0.3em] text-gray-400 mb-4">
            Regional Boutique Airline
          </p>

          <h1 className="text-6xl font-bold max-w-3xl leading-tight">
            Dairy Flat Airlines
          </h1>

          <p className="mt-6 text-xl text-gray-300 max-w-2xl leading-relaxed">
            Experience premium regional travel across New Zealand
            and Australia with our modern boutique airline booking system.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/search"
              className="bg-white text-black px-6 py-4 rounded-lg text-lg font-semibold"
            >
              Search Flights
            </Link>

            <Link
              href="/my-flights"
              className="border border-white px-6 py-4 rounded-lg text-lg"
            >
              My Flights
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              Search Flights
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              Browse scheduled regional flights across our boutique airline network.
            </p>

            <Link
              href="/search"
              className="text-blue-600 font-semibold"
            >
              Explore Flights →
            </Link>
          </div>

          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              Manage Bookings
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              View booking invoices, manage itineraries, and review flight details.
            </p>

            <Link
              href="/my-flights"
              className="text-blue-600 font-semibold"
            >
              View My Flights →
            </Link>
          </div>

          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              Flexible Cancellation
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              Cancel confirmed bookings quickly using your booking reference.
            </p>

            <Link
              href="/cancel"
              className="text-blue-600 font-semibold"
            >
              Cancel Booking →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">
              Dairy Flat Airlines
            </h3>

            <p className="text-gray-600">
              Built with Next.js, MongoDB Atlas, and Vercel.
            </p>
          </div>

          <div className="text-gray-500">
            © 2026 Dairy Flat Airlines
          </div>
        </div>
      </footer>
    </main>
  );
}