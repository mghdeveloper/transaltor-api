import express from "express";
import cors from "cors";
import { translate } from "@vitalets/google-translate-api";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// POST /translate
app.post("/translate", async (req, res) => {
  const { text, to } = req.body;

  if (!text || !to) {
    return res.status(400).json({
      success: false,
      error: "Please provide both 'text' and 'to' language code",
    });
  }

  try {
    const { text: translated } = await translate(text, { to });
    res.json({
      success: true,
      from: "auto",
      to,
      original: text,
      translated,
    });
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ success: false, error: "Translation failed" });
  }
});

// GET /translate quick test
app.get("/translate", async (req, res) => {
  try {
    const { text } = await translate("hi", { to: "fr" });
    res.json({
      success: true,
      from: "en",
      to: "fr",
      original: "hi",
      translated: text,
    });
  } catch (err) {
    console.error("Quick test failed:", err);
    res.status(500).json({ success: false, error: "Quick test failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Translation API running on http://localhost:${PORT}`);
});
