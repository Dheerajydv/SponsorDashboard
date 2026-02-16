import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
    {
        members: [
            {
                type: [String],
                default: [],
            },
        ],
    },
    {
        timestamps: true
    }
)

const TeamModel = mongoose.models?.TeamModel || mongoose.model("TeamModel", teamSchema);

export default TeamModel;