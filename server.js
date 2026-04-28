require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===== DEBUG (REMOVE LATER) =====
console.log("API KEY STATUS:", process.env.SARVAM_API_KEY ? "Loaded" : "Missing");

// ===== ROOT =====
app.get("/", (req, res) => {
  res.send("🚀 MechMinds AI Server Running");
});

// ===== CHAT =====
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({
        reply: "Please send a message",
        audio: ""
      });
    }

    let reply = "";

    // ==============================
    // 🧠 TRY SARVAM AI
    // ==============================
    try {
      const aiResponse = await axios.post(
        "https://api.sarvam.ai/v1/generate",
        {
          prompt: message,
          max_tokens: 50
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      reply = aiResponse?.data?.output || "";

    } catch (err) {
      console.log("⚠️ Sarvam failed:", err.response?.data || err.message);
    }

    // ==============================
    // 🔁 SMART FALLBACK (IMPORTANT)
    // ==============================
    if (!reply) {

      const msg = message.toLowerCase();

      if (msg.includes("iot")) {
        reply = "IoT stands for Internet of Things. It connects devices like sensors and machines to the internet so they can send and receive data.";
      } 
      else if (msg.includes("ai")) {
        reply = "AI stands for Artificial Intelligence. It allows machines to learn, think, and make decisions like humans.";
      } 
      else {
        reply = "I couldn't reach the AI service, but your question was: " + message;
      }
    }

    // ==============================
    // 🔊 AUDIO (WORKING ALWAYS)
    // ==============================
    const audioURL =
      "https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=" +
      encodeURIComponent(reply);

    // ==============================
    // ✅ RESPONSE
    // ==============================
    res.json({
      reply,
      audio: audioURL
    });

  } catch (err) {
    console.error("❌ SERVER ERROR:", err.message);

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
