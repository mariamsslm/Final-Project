import mongoose from "mongoose";
const validTypes = ["photographs", "drawings","writings"]

const postModelSchema = new mongoose.Schema(
    { 
        description: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: true,
            enum: validTypes
        },
        image: {
            type: String,
            required: false
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Like",
        }
    }, {
    timestamps: true
}
)
const postSchema = mongoose.model("Post", postModelSchema)
export default postSchema