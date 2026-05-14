import client from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const orig = searchParams.get("orig");
    const dest = searchParams.get("dest");

    if (!orig || !dest) {
      return Response.json({
        success: false,
        message: "Origin and destination are required",
      });
    }

    await client.connect();

    const db = client.db("airline-booking");

    const schedules = await db
      .collection("schedules")
      .find({
        origin: orig,
        destination: dest,
      })
      .sort({ departureTime: 1 })
      .toArray();

    const dates = Array.from(
      new Set(
        schedules.map((schedule: any) =>
          schedule.departureTime.split("T")[0]
        )
      )
    );

    return Response.json({
      success: true,
      dates,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Failed to fetch available dates",
    });
  }
}