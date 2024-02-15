import mongoose from "mongoose";

const userModelSchema = new mongoose.Schema(
    {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
        bio : {
          type : String,
          required : false
        },
        phone : {
          type : String,
          required : false
        },
        image : {
          type : String,
          required : false
        }
      },
      { timestamps: true }
    );
    const userSchema = mongoose.model("User",userModelSchema);
    export default userSchema;
    
