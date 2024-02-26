import jwt from "jsonwebtoken"
export const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      role : user.role
     
    },
    process.env.JWT_SECRET
  );
};
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
