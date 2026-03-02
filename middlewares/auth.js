import { User } from "../models/user.model.js";
import { clerkClient, getAuth } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const authData = getAuth(req);

    if (!authData.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.auth = authData;

    const dbUser = await User.findOne({
      clerkUserId: authData.userId,
    });

    if (!dbUser) {
      const clerkUser = await clerkClient.users.getUser(authData.userId);

      const newUser = await User.create({
        clerkUserId: authData.userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.fullName,
        role: clerkUser.unsafeMetadata?.role || "student",
      });
      req.dbUser = newUser;
    } else {
      req.dbUser = dbUser;
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Auth failed" });
  }
};
