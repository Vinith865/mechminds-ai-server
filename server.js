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

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b",
        temperature: 0.6,
        max_tokens: 150,   // 🔥 LIMIT SIZE (important)
        messages: [
          {
            role: "system",
            content:
              "You are MechMinds AI assistant. Give short, clear answers in plain text. Do not use tables, markdown, or formatting."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

// ===== START =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
