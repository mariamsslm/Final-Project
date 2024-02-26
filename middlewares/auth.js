import { verifyToken } from "../utils/jwt.js";

export const authorized = async (req, res, next) => {
    try {
      const token = req.cookies.userToken;
      if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
      } else {
        const decoded = verifyToken(token);
        req.user = decoded.data; 
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  export const checkRole = (role) => {
    return (req, res, next) => {
      try {
        const userRole = req.user.role;  
        if (userRole === role) {
          console.log("User authorized");
          next();
        } else {
          res.status(403).send("Forbidden: You don't have permission to access this resource");
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    };
  };