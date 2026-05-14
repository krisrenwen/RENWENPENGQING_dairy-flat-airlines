import client from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { bookingRef } = body;

    await client.connect();

    const db = client.db("airline-booking");

    const schedulesCollection =
      db.collection("schedules");

    const schedule = await schedulesCollection.findOne({
      "bookings.bookingRef": bookingRef,
    });

    if (!schedule) {
      return Response.json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = schedule.bookings.find(
      (item: any) =>
        item.bookingRef === bookingRef
    );

    if (!booking) {
      return Response.json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return Response.json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    await schedulesCollection.updateOne(
      {
        "bookings.bookingRef": bookingRef,
      },
      {
        $set: {
          "bookings.$.status": "cancelled",
        },
      }
    );

    return Response.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Cancellation failed",
    });
  }
}