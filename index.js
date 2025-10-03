import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // npm install node-fetch@2
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

// ✅ Ping remote URL every 10 seconds to keep awake
setInterval(async () => {
  try {
    const response = await fetch("https://libby.onrender.com/translate");
    console.log("Pinged remote server:", response.status);
  } catch (err) {
    console.error("Ping failed:", err.message);
  }
}, 10000); // 10000 ms = 10 seconds

app.listen(PORT, () => {
  console.log(`🚀 Translation API running on http://localhost:${PORT}`);
});
