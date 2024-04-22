import postSchema from "../models/post.js";



//add post
export const addPost = async (req, res) => {
  try {
    const userID = req.user.id;
    const { type, description } = req.body;
    console.log(userID)

    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    // Assuming postSchema is defined elsewhere and imported
    const newPost = new postSchema({
      type,
      image,
      description,
      userID
    });

    // Assuming postSchema.save() returns a promise
    await newPost.save();
    // Sending back the created post object as a response
    res.status(201).json(newPost);
  } catch (error) {
    // Logging the error
    console.error(error);
    // Sending a more descriptive error message
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};






// 
//get post by id
export const getPostById = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postSchema.findById(id).populate('userID');
    if (!post) {
      return res.status(404).json("Post Not Found");
    } else {
      return res.status(200).json({ message: "Post found", data: post });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

/// get by date
export const getAllPost = async (req, res) => {
  try {
    const getPost = await postSchema.find().populate('userID').sort({ createdAt: -1 });
    if (!getPost || getPost.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    } else {
      return res.status(200).json({ message: "All posts", data: getPost });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

//add photographs
export const addPhotograph = async (req, res) => {
  try {
    const { description, userID } = req.body;
    const image = req.file.filename
    const newPost = new postSchema({ description, type: "photographs", image, userID });
    await newPost.save();
    res.status(201).json({ data: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// adding drawings
export const addDrawing = async (req, res) => {
  try {
    const { description, userID } = req.body;
    const image = req.file.filename
    const newPost = new postSchema({ description, type: "drawings", image, userID });
    await newPost.save();
    res.status(201).json({ data: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// For getting all drawings
export const getAllDrawings = async (req, res) => {
  try {
    const drawings = await postSchema.find({ type: "drawings" }).populate('userID');
    res.status(200).json({ data: drawings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// For getting a drawing by ID
export const getDrawingById = async (req, res) => {
  const id = req.params.id;
  try {
    const drawing = await postSchema.findOne({ _id: id, type: "drawings" }).populate('userID');
    if (!drawing) {
      return res.status(404).json({ error: "Drawing not found" });
    }
    res.status(200).json({ data: drawing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


//gettings all Wrtings
export const getAllWritings = async (req, res) => {
  try {
    const writings = await postSchema.find({ type: "writings" }).populate('userID');
    res.status(200).json({ data: writings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


//get single writings
export const getWritingById = async (req, res) => {
  const id = req.params.id;
  try {
    const writings = await postSchema.findOne({ _id: id, type: "writings" }).populate('userID');
    if (!writings) {
      return res.status(404).json({ error: "writing not found" });
    }
    res.status(200).json({ data: writings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};





// For getting all photographs
export const getAllPhotographs = async (req, res) => {
  try {
    const photographs = await postSchema.find({ type: "photographs" }).populate('userID');
    res.status(200).json({ data: photographs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// For getting a photograph by ID
export const getPhotographById = async (req, res) => {
  const id = req.params.id;
  try {
    const photograph = await postSchema.findOne({ _id: id, type: "photographs" }).populate('userID');
    if (!photograph) {
      return res.status(404).json({ error: "Photograph not found" });
    }
    res.status(200).json({ data: photograph });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



//get last post

export const getLastPosts = async (req, res) => {
  try {
    const lastPosts = await postSchema.find().sort({ createdAt: -1 }).limit(8).populate('userID');
    res.status(200).json({ data: lastPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



//get all posts for one user
export const getUserPosts = async (req, res) => {
  const userId = req.params.id; // Assuming the user ID is passed as a URL parameter

  try {
    const userPosts = await postSchema.find({ userID: userId }).populate('userID');

    if (!userPosts || userPosts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json({ data: userPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



//update users update own posts
export const updatePostById = async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;
  const image = req.file.filename;
  const userId = req.user.id; 
  
  try {
  
    const drawing = await postSchema.findById(id);
    console.log(drawing)
    if (!drawing) {
      return res.status(404).json({ error: "Post not found" });
      
    }

    const drawingUserId = drawing.userID.toString(); 
const requestUserId = userId.toString(); 

if (drawingUserId !== requestUserId) {
  return res.status(403).json({ error: "You are not authorized to update this drawing" });
}

  
    const updatedPost = await postSchema.findByIdAndUpdate(
      { _id: id },
      { description, image },
      { new: true }
    );
    
    res.status(200).json({ message: "Post updated successfully", data: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};





//delete users delete own posts

export const deleteOwnPost = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  
  try {
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Find the post by id
    const post = await postSchema.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the authenticated user is the owner of the post
    if (post.userID.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this post" });
    }

    // Delete the post
    await postSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


//for admin
// For deleting a post by ID
export const deleteDrawingById = async (req, res) => {
  const id = req.params.id;
  try {
    await postSchema.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "post deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


//delete all posts
export const deleteAllDrawings = async (req, res) => {
  try {
    await postSchema.deleteMany({});
    res.status(200).json({ message: "All posts deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// For updating a drawing by ID
export const updateDrawingById = async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;
  const image = req.file.filename
  try {
    const updatedDrawing = await postSchema.findByIdAndUpdate(
      { _id: id },
      { description, image },
      { new: true }
    );
    res.status(200).json({ message: "post update successfuly", data: updatedDrawing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//add post
export const addPostAmin = async (req, res) => {
  
  try {
    const {userId , type, description } = req.body;

    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    // Assuming postSchema is defined elsewhere and imported
    const newPost = new postSchema({
      type,
      image,
      description,
      userID : userId
    });

    // Assuming postSchema.save() returns a promise
    await newPost.save();
    // Sending back the created post object as a response
    res.status(201).json(newPost);
  } catch (error) {
    // Logging the error
    console.error(error);
    // Sending a more descriptive error message
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};



//get images
export const getAllPostImages = async (req, res) => {
  try {
    const postImages = await postSchema.find({ image: { $ne: null } }, { image: 1, _id: 0 }).sort({ createdAt: -1 });
    if (!postImages || postImages.length === 0) {
      return res.status(404).json({ message: "No post images found" });
    } else {
      return res.status(200).json({ message: "All post images", data: postImages });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

//get latest images
export const getLastThreePostImages = async (req, res) => {
  try {
    const lastThreePostImages = await postSchema
      .find({ image: { $ne: null } }, { image: 1, _id: 0 })
      .sort({ createdAt: -1 })
      .limit(3);

    if (!lastThreePostImages || lastThreePostImages.length === 0) {
      return res.status(404).json({ message: "No post images found" });
    } else {
      return res.status(200).json({ message: "Last three post images", data: lastThreePostImages });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};


