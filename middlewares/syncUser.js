import { User } from "../models/user.model.js";

export const syncUser = async (req, res, next) => {
  try {
    const auth = req.auth();
    const { role, email, name } = auth.sessionClaims;
    const clerkUserId = auth.userId;

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = await User.create({
        clerkUserId,
        email,
        name,
        role: role || "student",
      });
    } else {
      // 🔥 ALWAYS SYNC DB WITH CLERK
      user.email = email;
      user.name = name;
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
