import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you have a user model
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Note",
    },
    originalTranscript: {
      type: String,
      required: true,
    },
    formattedTranscript: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
