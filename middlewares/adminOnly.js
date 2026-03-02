export const adminOnly = (req, res, next) => {

  if (!req.dbUser) {
    return res.status(500).json({ message: "dbUser missing" });
  }

  if (req.dbUser.role !== "instructor") {
    return res.status(403).json({
      message: "Access denied. Instructor only.",
    });
  }
  next();
};
