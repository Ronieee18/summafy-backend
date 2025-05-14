import dotenv from "dotenv";
import axios from "axios";
import Note from "../models/Note.js";
dotenv.config();
export const formatNote = async (req, res) => {
  const { transcript } = req.body;

  const prompt = `
You are a professional note-taker and summarizer.

Given a raw transcript of a spoken lecture or explanation, your job is to:

1. **Structure the content into clean, elegant notes**.
2. **Use beautiful formatting with headings, bullet points, and sub-points**.
3. **Keep only the useful information**, removing repetition, filler words, and incomplete phrases.
4. **Format the notes in Markdown** style for rendering.

## Formatting Rules:
- Use clear section headers (e.g., ## Introduction, ## Key Concepts)
- Use a variety of bullet styles:  
  • For primary points  
  ▸ For subpoints  
  ➤ For further nested ideas  
  ⦿ For lists of facts or features
- Use numbered lists where steps or sequences are involved
- Keep each point concise and readable
- If appropriate, include:
  - Definitions
  - Examples
  - Analogies
  - Summarized insights

---

### Example Output Format:

## Topic Title

• Key Point 1  
▸ Explanation or detail  
➤ Supporting fact or reasoning

• Key Point 2  
▸ Example  
⦿ Sub-facts

---

Now format the following transcript accordingly:

"""
${transcript}
"""

`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
            role: "user",
          },
        ],
      }
    );

    const formatted = response.data.candidates[0].content.parts[0].text;
    res.json({ formatted });
  } catch (error) {
    console.error("Gemini formatting error:", error.message);
    res.status(500).json({ error: "Formatting failed" });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, originalTranscript, formattedTranscript } = req.body;

    if (!originalTranscript || !formattedTranscript) {
      return res.status(400).json({ error: "Transcript fields are required" });
    }

    const newNote = new Note({
      user: req.user._id, // assuming you're using auth middleware
      title,
      originalTranscript,
      formattedTranscript,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Create Note Error:", err);
    res.status(500).json({ error: "Server error while saving note" });
  }
};

export const getUserNotes = async (req, res) => {
  try {
    console.log("User ID:", req.user._id);
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log("Fetched Notes:", notes);
    res.json(notes);
  } catch (err) {
    console.error("Get Notes Error:", err);
    res.status(500).json({ error: "Unable to fetch notes" });
  }
};

// @desc Get a single note
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Error fetching note" });
  }
};
