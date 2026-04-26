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
  res.send("🚀 MechMinds AI Server Running (Sarvam)");
});

// ===== CHAT + TTS =====
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // 🧠 AI TEXT RESPONSE
    const aiResponse = await axios.post(
      "https://api.sarvam.ai/v1/chat/completions",
      {
        model: "sarvam-m",
        messages: [
          {
            role: "system",
            content:
              "You are MechMinds AI assistant. Give short, clear answers in plain text."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      aiResponse.data.choices?.[0]?.message?.content || "No response";

    // 🔊 TTS GENERATION
    const ttsResponse = await axios.post(
      "https://api.sarvam.ai/v1/audio/speech",
      {
        input: reply,
        voice: "female",   // or male
        format: "mp3"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SARVAM_API_KEY}`
        }
      }
    );

    const audioURL = ttsResponse.data.audio_url;

    res.json({
      reply,
      audio: audioURL
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Sarvam AI failed" });
  }
});

// ===== START =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
