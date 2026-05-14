import BookingForm from "./BookingForm";

export default async function BookingPage({
    params,
}: {
    params: Promise<{ scheduleId: string }>;
}) {
    const { scheduleId } = await params;

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">Book Flight</h1>
            <BookingForm scheduleId={scheduleId} />
        </main>
    );
}