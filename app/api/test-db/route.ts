import client from "@/lib/mongodb";

export async function GET() {
  try {
    await client.connect();

    const db = client.db("airline-booking");

    const collections = await db.listCollections().toArray();

    return Response.json({
      success: true,
      message: "MongoDB connected successfully",
      collections,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Database connection failed",
    });
  }
}