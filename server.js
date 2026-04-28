require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===== ROOT =====
app.get("/", (req, res) => {
  res.send("🚀 MechMinds AI Server Running");
});

// ===== CHAT =====
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    let reply = "";
    let audioURL = "";

    // ==============================
    // 🧠 STEP 1 — SARVAM TEXT
    // ==============================
    try {
      const aiResponse = await axios.post(
        "https://api.sarvam.ai/v1/generate",
        {
          prompt: message,
          max_tokens: 40
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      reply = aiResponse?.data?.output || "";

    } catch (aiErr) {
      console.log("⚠️ Sarvam AI failed:", aiErr.response?.data || aiErr.message);
    }

    // ==============================
    // 🔁 FALLBACK (NEVER FAIL)
    // ==============================
    if (!reply) {
      reply = "IoT means connecting devices to the internet so they can send and receive data.";
    }

    // ==============================
    // 🔊 STEP 2 — SARVAM TTS
    // ==============================
    try {
      const ttsResponse = await axios.post(
        "https://api.sarvam.ai/v1/tts",
        {
          text: reply
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SARVAM_API_KEY}`
          }
        }
      );

      audioURL = ttsResponse?.data?.audio_url || "";

    } catch (ttsErr) {
      console.log("⚠️ TTS failed:", ttsErr.response?.data || ttsErr.message);
    }

    // ==============================
    // ✅ ALWAYS RETURN SUCCESS
    // ==============================
    res.json({
      reply,
      audio: audioURL
    });

  } catch (err) {
    console.error("❌ SERVER ERROR:", err.message);

    // 🔥 FINAL FALLBACK (NEVER BREAK ESP32)
    res.json({
      reply: "Server fallback response working.",
      audio: ""
    });
  }
});

// ===== START SERVER =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
