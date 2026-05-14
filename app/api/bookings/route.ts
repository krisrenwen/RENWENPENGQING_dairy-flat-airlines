import client from "@/lib/mongodb";
import { ObjectId, type Document } from "mongodb";

function generateBookingRef() {
  return (
    "BK" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scheduleId, passengerName, email } = body;

    await client.connect();

    const db = client.db("airline-booking");
    const schedulesCollection = db.collection<Document>("schedules");

    const schedule = await schedulesCollection.findOne({
      _id: new ObjectId(scheduleId),
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

    if (confirmedBookings.length >= schedule.capacity) {
      return Response.json({
        success: false,
        message: "Flight is full",
      });
    }

    const bookingRef = generateBookingRef();

    const newBooking = {
      bookingRef,
      passengerName,
      email,
      status: "confirmed",
      bookedAt: new Date().toISOString(),
    };

    await schedulesCollection.updateOne(
        { _id: new ObjectId(scheduleId) },
        {
            $push: {
            bookings: newBooking as any,
            },
        }
    );

    return Response.json({
      success: true,
      bookingRef,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Booking failed",
    });
  }
}