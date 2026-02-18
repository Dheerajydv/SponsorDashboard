import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SponsorModel from "@/models/sponsors.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, amount, businessType, location, assignedTeam, pakage } = body;

    // Basic validation
    if (
      !name ||
      !amount ||
      !businessType ||
      !location ||
      !assignedTeam ||
      !pakage
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    const newSponsor = await SponsorModel.create({
      name,
      amount,
      businessType,
      location,
      assignedTeam,
      pakage,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Sponsor created successfully",
        data: newSponsor,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Sponsor Creation Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 },
    );
  }
}
