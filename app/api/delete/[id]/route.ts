import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SponsorModel from "@/models/sponsors.model";
import mongoose from "mongoose";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX HERE

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Sponsor ID" },
        { status: 400 },
      );
    }

    const deletedSponsor = await SponsorModel.findByIdAndDelete(id);

    if (!deletedSponsor) {
      return NextResponse.json(
        { success: false, message: "Sponsor not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Sponsor deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Sponsor Error:", error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
