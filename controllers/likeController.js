import likeSchema from "../models/like.js";
import postSchema from "../models/post.js";
// export default getLikeCountForPost = async(postId)=>{
//     try{
//         const likeCount =await likeSchema.countDocuments({postID : postId})
//         return likeCount
//     }catch (error) {
//         console.error("Error counting likes:", error)
//         throw error;

//     }
// }

//post like
export const addLike = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postSchema.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const like = new likeSchema({
      userID: req.user.id,
      postID: id,
    });
    await like.save();
    await postSchema.findByIdAndUpdate(
      post._id,
      { $push: { likes: like._id } },
      { new: true }
    );
    res.status(200).json(post);
  } catch (error) {
    console.error("Error liking the post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};








export const unlikePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postSchema.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the index of the like associated with the current user
    const likeIndex = post.likes.findIndex(like => like.equals(req.user.id));

    if (likeIndex === -1) {
      return res.status(404).json({ message: "You haven't liked this post yet" });
    }

    // Remove the like at the found index
    post.likes.splice(likeIndex, 1);

    // Update the post with the updated likes array
    const updatedPost = await postSchema.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error unliking the post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



//nb of like 
export const getLikesByPostId = async (req, res) => {
  try {
    const id = req.params.id; // Extract post ID from request parameters

    // Find the post by ID
    const post = await postSchema.findById(id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Get the number of likes for the post
    const numberOfLikes = post.likes.length;

    // Return the number of likes for the post
    return res.status(200).json({ postId: post._id, numberOfLikes });
  } catch (error) {
    console.error("Error getting number of likes for post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};






//number of like for each post
export const getLikesByPost= async (req, res) => {
  try {
    // Get all posts
    const posts = await postSchema.find();

    // Iterate through each post and get the number of likes
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const numberOfLikes = post.likes.length;
        return { _id: post._id, numberOfLikes };
      })
    );

    // Return posts with number of likes
    res.status(200).json(postsWithLikes);
  } catch (error) {
    console.error("Error getting number of likes for posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
