import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.js";
import "./config/passport.js";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://summafyy.netlify.app", // frontend URL
    credentials: true, // allow cookies across origins
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none", // ← allow sending cookies to frontend
      secure: true, // ← true only if you're using HTTPS
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);
app.use("/auth", authRouter);

export { app };
