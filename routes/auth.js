import { Router } from "express";
import passport from "passport";

const authRouter = Router();
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/auth/success",
    failureRedirect: "/auth/failure",
  })
);

// Auth check
authRouter.get("/success", (req, res) => {
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
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export { authRouter };
