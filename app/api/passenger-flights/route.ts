import client from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const email = searchParams.get("email");

    if (!email) {
      return Response.json({
        success: false,
        message: "Email is required",
      });
    }

    await client.connect();

    const db = client.db("airline-booking");

    const schedules = await db
      .collection("schedules")
      .find({
        "bookings.email": email,
      })
      .toArray();

    const results = schedules.flatMap((schedule: any) => {
      return schedule.bookings
        .filter(
          (booking: any) =>
            booking.email === email
        )
        .map((booking: any) => ({
          bookingRef: booking.bookingRef,
          status: booking.status,
          passengerName: booking.passengerName,

          flightNo: schedule.flightNo,
          origin: schedule.origin,
          destination: schedule.destination,

          departureTime:
            schedule.departureTime,

          arrivalTime:
            schedule.arrivalTime,

          aircraft: schedule.aircraft,
          price: schedule.price,
        }));
    });

    return Response.json({
      success: true,
      count: results.length,
      flights: results,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Failed to fetch flights",
    });
  }
}