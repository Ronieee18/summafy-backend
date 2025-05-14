import { Router } from "express";
import { createNote, formatNote, getNoteById, getUserNotes } from "../controllers/voicenote.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/format", formatNote);
router.post("/note/create",isAuthenticated,createNote);
router.get("/note", isAuthenticated, getUserNotes);
router.get("/note/:id", isAuthenticated, getNoteById);



export { router };
