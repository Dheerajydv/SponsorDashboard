import mongoose, { Schema } from "mongoose";

const sponsorSchema = new Schema(
  {
    name: {
      type: String,
      required: true
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
    teamAssigned: {
      type: String,
      required: true,
    } 
  },
  {
    timestamps: true
  }
)

const SponsorModel = mongoose.models?.SponsorModel || mongoose.model("SponsorModel", sponsorSchema);

export default SponsorModel;


// id: 1,
//     sponsorName: "Dominos",
//     businessType: "Food & Beverage",
//     location: "Downtown",
//     assignedTeam: "Team A",
//     responseType: "Very Interested",
//     followUpStatus: "Pending",
//     finalStatus: "Negotiation",
//     amount: "₹5,00,000",