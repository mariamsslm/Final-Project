import likeSchema from "../models/like";


export default getLikeCountForPost = async(postId)=>{
    try{
        const likeCount =await likeSchema.countDocuments({postID : postId})
        return likeCount
    }catch (error) {
        console.error("Error counting likes:", error)
        throw error;

    }
}