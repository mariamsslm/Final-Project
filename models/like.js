import mongoose from "mongoose";


const likeModelSchema = new mongoose.Schema({
    userID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    postID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        required : true

    }
},
{
    timestamps: true
}
)
const likeSchema = mongoose.model("Like",likeModelSchema)
export default likeSchema