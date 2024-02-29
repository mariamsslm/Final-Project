import userSchema from "../models/user.js";
import bcrypt from 'bcrypt'
import { verifyToken, createToken } from "../utils/jwt.js";


//SignUp 
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, bio, phone} = req.body;
    const image = req.file.filename

    // Check if required fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required." });
    }

    // Check if the user with the given email or name already exists
    const existingUser = await userSchema.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email or name already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new userSchema({
      name,
      email,
      password: hash,
      role,
      bio,
      phone,
      image
    });

    // Save the new user to the database
    await newUser.save();

    // Create a JWT token for the new user
    const token = createToken(newUser);

    // Decode the token
    const decoded = verifyToken(token);

    // Set the token in a cookie and send a response
    res.status(200)
      .cookie("userToken", token, {
        secure: true,
        httpOnly: true,
        sameSite: "None",
      })
      .json({ message: "User created successfully", token: decoded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};






//Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    const token = createToken(user);
    const decoded = verifyToken(token);

    res.cookie("userToken", token, {
      secure: true,
      httpOnly: true,
      sameSite: "None",
    }).status(200).json({ message: "User logged in successfully", token: decoded });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};






//sign up google
export const gsignup = async (req, res) => {
  const { name, email, role, photourl, phone } = req.body;
  const generatedPassword = "random";
  const password = req.body.password || generatedPassword;
  const picture = req.file;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    // handles an already authenticated account
    const user = await userSchema.findOne({ email: email });
    if (user) {
      const token = createToken(user);
      const decoded = verifyToken(token);
      res
        .cookie("userToken", token, {
          secure: true,
          httpOnly: true,
          sameSite: "None",
        })
        .status(200)
        .json({ message: "user logged in successfully", token: decoded });
      console.log(res);
      //
    } else {
      const newUser = new userSchema({
        name,
        email,
        password: hash,
        role,
        picture: picture,
        photourl,
        phone,
      });
      await newUser.save();
      const token = createToken(newUser);
      const decoded = verifyToken(token);
      res
        .status(200)
        .cookie("userToken", token, {
          secure: true,
          httpOnly: true,
          sameSite: "None",
        })
        .json({ message: "user created successfully", token: decoded });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Something went wrong !");
  }
};













// get all users
export const getAll = async (req, res) => {
  try {
    const allUsers = await userSchema.find();
    return res.status(200).json({ Users: allUsers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "cannot fetch users" });
  }
};


//get user by id 
export const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const findData = await userSchema.findOne({ _id: id })
    if (!findData)
      res.status(404).json('No User Found')
    res.status(200).json({data:findData})
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}





//
export const getOne = async (req, res) => {
  const token = req.cookies.userToken;
  const decoded = verifyToken(token);
  const id = decoded.data ? decoded.data.id : undefined;
  try {
    if (!id) {
      return res.status(400).json({ error: "NO Token!!!!!!!" });
    }
    const user = await userSchema.findById(id);
    console.log("getOne user", user);
    if (user) {
      return res.status(200).json({
        Picture: user.picture,
        Role: user.role,
        id: user._id,
        name: user.name,
        photourl: user.photourl,
        phone: user.phone,
      });
    } else {
      return res.status(404).json({ error: "User Not Found!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldn't find user" });
  }
};


//delete user
export const deleteUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userSchema.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    await userSchema.deleteOne({ _id: id });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


//delete all users
export const deleteAllUsers = async (req, res) => {
  try {
    await userSchema.deleteMany({});
    res.status(200).json({ message: "All users deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};




//update user 
// export const updateUser = async (req, res) => {
//   try {
//     // Get the logged-in user's role from the request object
//     const loggedInUserRole = req.user.role; // Assuming the user's role is stored in the request object

//     // Extract user ID and updated attributes from the request body
//     const { id, ...updatedAttributes } = req.body;

//     // Find the user by ID
//     let user = await userSchema.findById(id);

//     // Check if the user exists
//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     // If the logged-in user is an admin, they can update any user's attributes
//     if (loggedInUserRole === "admin") {
//       // Update the user's attributes
//       Object.assign(user, updatedAttributes);
//     } else {
//       // If the logged-in user is a regular user, they can update all attributes except the role
//       // Remove the role attribute from updatedAttributes to prevent regular users from updating it
//       delete updatedAttributes.role;

//       // Update the user's attributes
//       Object.assign(user, updatedAttributes);
//     }

//     // Save the updated user to the database
//     await user.save();

//     // Return success message with updated user
//     res.status(200).json({ message: "User updated successfully.", user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const updateUser = async (req, res) => {
//   try {
//     // Get the logged-in user's role from the request object
//     const loggedInUserRole = req.user.role; // Assuming the user's role is stored in the request object

//     // Extract user ID and updated attributes from the request body
//     const { id, name, email, password, bio, phone, image } = req.body;

//     // Find the user by ID
//     let user = await userSchema.findById(id);

//     // Check if the user exists
//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     // If the logged-in user is an admin, they can update any user's attributes
//     if (loggedInUserRole === "admin") {
//       // Update the user's attributes
//       if (name) user.name = name;
//       if (email) user.email = email;
//       if (password) user.password = password;
//       if (bio) user.bio = bio;
//       if (phone) user.phone = phone;
//       if (image) user.image = image;
//     } else {
//       // If the logged-in user is a regular user, they can update all attributes except the role
//       // Remove the role attribute from updatedAttributes to prevent regular users from updating it
//       if (name) user.name = name;
//       if (email) user.email = email;
//       if (password) user.password = password;
//       if (bio) user.bio = bio;
//       if (phone) user.phone = phone;
//       if (image) user.image = image;
//     }

//     // Save the updated user to the database
//     await user.save();

//     // Return success message with updated user
//     res.status(200).json({ message: "User updated successfully.", user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };




// export const updateUser = async (req, res) => {
//   try {
//     // Get the logged-in user's role and ID from the request object
//     const loggedInUserRole = req.user.role;
//     const loggedInUserId = req.user._id;

//     // Extract user ID and updated attributes from the request body
//     const { id, name, email, password, bio, phone, image, role } = req.body;

//     // Find the user by ID
//     let user = await userSchema.findById(id);

//     // Check if the user exists
//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     // If the logged-in user is an admin and is not updating their own role
//     if (loggedInUserRole === "admin" && id !== loggedInUserId) {
//       // Update all user's attributes including the role
//       if (name) user.name = name;
//       if (email) user.email = email;
//       if (password) user.password = password;
//       if (bio) user.bio = bio;
//       if (phone) user.phone = phone;
//       if (image) user.image = image;
//       if (role) user.role = role; // Admin can update the role
//     } else if (loggedInUserRole === "admin" && id === loggedInUserId && role) {
//       // Admin cannot update own role
//       return res.status(403).json({ error: "Admin cannot update own role." });
//     } else {
//       // Regular user updating own information
//       // Update all attributes except the role
//       if (name) user.name = name;
//       if (email) user.email = email;
//       if (password) user.password = password;
//       if (bio) user.bio = bio;
//       if (phone) user.phone = phone;
//       if (image) user.image = image;
//     }

    // Save the updated user to the database
//     await user.save();

//     // Return success message with updated user
//     res.status(200).json({ message: "User updated successfully.", user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };




//logout 
export const logout = async (req, res) => {
  res.clearCookie('userToken'); 
  res.status(200).json({ message: 'Logged out successfully' });
};



// update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const role = req.user.role;

    // Check if the logged-in user is a regular user
    if (role === 'user') {
      const { id, name, email, password, bio, phone } = req.body;
      const image = req.file.filename

      // Check if the user is trying to update their own profile
      if (id !== loggedInUserId) {
        return res.status(403).json({ error: "You are not allowed to update other users' profiles." });
      }

      // Find the user by ID
      let user = await userSchema.findById(id);

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Update user attributes
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      if (bio) user.bio = bio;
      if (phone) user.phone = phone;
      if (image) user.image = image;

      // Save the updated user to the database
      await user.save();

      // Return success message with updated user
      res.status(200).json({ message: "User profile updated successfully.", user });
    } else {
      // If the logged-in user is not a regular user, return a 403 Forbidden error
      return res.status(403).json({ error: "Only regular users are allowed to update their profiles." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};





//update role of user to admin or inverse  *********
export const updateUserRole = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const loggedInUserRole = req.user.role;

    // Check if the logged-in user is an admin
    if (loggedInUserRole === 'admin') {
      const { id, role } = req.body;

      // Find the user by ID
      let user = await userSchema.findById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Admin cannot update their own role
      if (id === loggedInUserId) {
        return res.status(403).json({ error: "Admin cannot update own role." });
      }

      // Update user role
      if (role) {
        user.role = role;
        await user.save();
      }

      res.status(200).json({ message: "User role updated successfully.", user });
    } else {
      // If the logged-in user is not an admin, return a 403 Forbidden error
      return res.status(403).json({ error: "Only admin users are allowed to update user roles." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};




