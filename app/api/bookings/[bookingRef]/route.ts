import client from "@/lib/mongodb";

export async function GET(
  request: Request,
  context: { params: Promise<{ bookingRef: string }> }
) {
  try {
    const { bookingRef } = await context.params;

    await client.connect();

    const db = client.db("airline-booking");

    const schedule = await db.collection("schedules").findOne({
      "bookings.bookingRef": bookingRef,
    });

    if (!schedule) {
      return Response.json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = schedule.bookings.find(
      (item: any) => item.bookingRef === bookingRef
    );

    return Response.json({
      success: true,
      booking,
      schedule: {
        _id: schedule._id,
        flightNo: schedule.flightNo,
        origin: schedule.origin,
        destination: schedule.destination,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        aircraft: schedule.aircraft,
        price: schedule.price,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
}