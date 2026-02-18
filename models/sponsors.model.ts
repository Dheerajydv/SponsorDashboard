import mongoose, { Schema } from "mongoose";

const sponsorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    assignedTeam: {
      type: String,
      required: true,
    },
    pakage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const SponsorModel =
  mongoose.models?.SponsorModel ||
  mongoose.model("SponsorModel", sponsorSchema);

export default SponsorModel;
