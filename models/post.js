import mongoose from "mongoose";
const validTypes = ["photographs", "drawing"]

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
            required: true
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