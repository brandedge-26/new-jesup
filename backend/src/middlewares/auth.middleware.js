import { verifyAccessToken } from "../utils/tokens.js";
import User from "../models/User.js";


const authMiddleware = async (req, res, next) => {
  try {


    // CHECK AUTHORIZATION HEADER
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authentication required. Please login to access this resource.", { cause: { statusCode: 401 } });
    }

    // EXTRACT TOKEN
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = verifyAccessToken(token);

    // ATTACH USER TO REQUEST
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new Error("User not found", { cause: { statusCode: 401 } });
    }

    req.user = user;
    next();


  } catch (err) {
    if (!err.cause) {
      err.cause = { statusCode: 401 };
    }
    next(err);
  }
};


export { authMiddleware };