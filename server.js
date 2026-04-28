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

    // ===== TRY SARVAM (TEXT ONLY) =====
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
    } catch (err) {
      console.log("⚠️ Sarvam failed:", err.response?.data || err.message);
    }

    // ===== FALLBACK (ALWAYS RETURN SOMETHING) =====
    if (!reply) {
      reply =
        "IoT means connecting devices to the internet so they can send and receive data.";
    }

    // ===== WORKING AUDIO (ESP32 SAFE) =====
    const audioURL =
      "https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=" +
      encodeURIComponent(reply);

    // ===== RESPONSE =====
    res.json({
      reply,
      audio: audioURL
    });
  } catch (err) {
    console.error("❌ SERVER ERROR:", err.message);

    // FINAL FALLBACK (never break ESP32)
    res.json({
      reply: "Server fallback working",
      audio: ""
    });
  }
});

// ===== START =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
