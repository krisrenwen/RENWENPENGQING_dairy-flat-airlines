import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await client.connect();

    const db = client.db("airline-booking");

    const schedule = await db.collection("schedules").findOne({
      _id: new ObjectId(id),
    });

    if (!schedule) {
      return Response.json({
        success: false,
        message: "Schedule not found",
      });
    }

    const confirmedBookings = schedule.bookings.filter(
      (booking: any) => booking.status === "confirmed"
    );

    return Response.json({
      success: true,
      schedule: {
        ...schedule,
        seatsLeft:
          schedule.capacity - confirmedBookings.length,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Failed to fetch schedule",
    });
  }
}