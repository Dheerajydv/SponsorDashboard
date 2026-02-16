import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SponsorModel from "@/models/sponsors.model";

export async function GET() {
  try {
    await connectDB();

    const sponsors = await SponsorModel.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: sponsors.length,
        data: sponsors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Sponsors Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}