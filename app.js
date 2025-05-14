import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.js";
import "./config/passport.js";
import MongoStore from "connect-mongo";

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
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL, // make sure this is set in your .env file
      ttl: 14 * 24 * 60 * 60, // Session lifetime (optional)
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none", // for cross-origin cookies
      secure: true, // for HTTPS only
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);
app.use("/auth", authRouter);

export { app };
