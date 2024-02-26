import postSchema from "../models/post.js";



//add post
export const addPost =async(req,res)=>{
  try {
    const { description, type, userID } = req.body;
    const image = req.file.filename
        const newPost = new postSchema({
        description,
        type,
        image,
        userID
    });
    await newPost.save();

    res.status(201).json(newPost);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post" });
}
};
  


//  get all post
export const getAllPost = async (req, res) => {
  try {
    const getPost = await postSchema.find().populate('userID');
    if (!getPost) {
      res.status(404).json("Post Not Found")
    }
    else {
      res.status(200).json({ message: "all posts", data: getPost })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
}

//add photographs
export const addPhotograph = async (req, res) => {
  try {
    const { description,  userID } = req.body;
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
    const newPost = new postSchema({ description, type: "drawing", image, userID });
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
    const drawings = await postSchema.find({ type: "drawing" }).populate('userID');
    res.status(200).json({data: drawings});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// For getting a drawing by ID
export const getDrawingById = async (req, res) => {
  const id = req.params.id;
  try {
    const drawing = await postSchema.findOne({ _id: id, type: "drawing" }).populate('userID');
    if (!drawing) {
      return res.status(404).json({ error: "Drawing not found" });
    }
    res.status(200).json({data: drawing});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// For getting all photographs
export const getAllPhotographs = async (req, res) => {
  try {
    const photographs = await postSchema.find({ type: "photographs" }).populate('userID');
    res.status(200).json({data:photographs});
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
    res.status(200).json({data:photograph});
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
    res.status(200).json({message:"post update successfuly",data:updatedDrawing});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// For deleting a drawing by ID
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


