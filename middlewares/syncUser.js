import { User } from "../models/user.model.js";

export const syncUser = async (req, res, next) => {
  try {
    const clerkUserId = req.auth.userId;
    const { role, email, name } = req.auth.sessionClaims;

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = await User.create({
        clerkUserId,
        email,
        name,
        role: role || "student",
      });
    } else if (user.role !== role) {
      user.role = role || "student";
      await user.save();
    }

    req.dbUser = user;
    next();
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ message: "Sync failed" });
  }
};
