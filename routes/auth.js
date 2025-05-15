import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
const authRouter = Router();
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log("User authenticated:", req.user);
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Generated JWT token:", token);
    // Redirect with token in URL (hash to avoid exposing to server)
    res.redirect(`https://summafyy.netlify.app/auth/verify#token=${token}`);
  }
);

// Auth check
authRouter.get("/success", isAuthenticated, (req, res) => {
  res.json({ success: true, user: req.user });
});

authRouter.get("/failure", (req, res) => {
  res.json({ success: false, message: "Login failed" });
});

// Logout
authRouter.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // default session cookie name
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

authRouter.get("/user", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.id).then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export { authRouter };
