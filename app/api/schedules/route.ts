import client from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const orig = searchParams.get("orig");
    const dest = searchParams.get("dest");
    const date1 = searchParams.get("date1");
    const date2 = searchParams.get("date2");

    await client.connect();

    const db = client.db("airline-booking");

    const query: any = {};

    if (orig) {
      query.origin = orig;
    }

    if (dest) {
      query.destination = dest;
    }

    if (date1 || date2) {
      query.departureTime = {};

      if (date1) {
        query.departureTime.$gte = new Date(date1).toISOString();
      }

      if (date2) {
        query.departureTime.$lte = new Date(date2).toISOString();
      }
    }

    const schedules = await db
      .collection("schedules")
      .find(query)
      .sort({ departureTime: 1 })
      .toArray();

    const results = schedules.map((schedule) => {
      const confirmedBookings = schedule.bookings.filter(
        (booking: any) => booking.status === "confirmed"
      );

      return {
        ...schedule,
        seatsLeft: schedule.capacity - confirmedBookings.length,
      };
    });

    return Response.json({
      success: true,
      count: results.length,
      schedules: results,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Failed to fetch schedules",
    });
  }
}