import mongoose from "mongoose";
const postModelSchema = new mongoose.Schema(
    {
        description : {
            type : String,
            required : false
        },
        type : {
            type : String ,
            required : true
        },
        image : {
            type : String,
            required : true
        },
        userID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        }

    },{
        timestamps: true
    }
)
const postSchema = mongoose.model("Post",postModelSchema)
export default postSchema