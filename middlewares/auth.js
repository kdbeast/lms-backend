import { getAuth } from "@clerk/express";

export const auth = (req, res, next) => {
  try {
    const authData = getAuth(req);

    if (!authData.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.auth = authData;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};
