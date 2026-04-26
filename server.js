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
  res.send("🚀 MechMinds AI Server (Groq) Running");
});

// ===== CHAT ENDPOINT =====
app.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are MechMinds AI assistant. Help students with IoT, robotics, and engineering in a simple way."
      },
      ...(history || []),
      {
        role: "user",
        content: message
      }
    ];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b",
        messages: messages,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "AI request failed"
    });
  }
});

// ===== OPTIONAL COMMAND ROUTE =====
app.post("/command", (req, res) => {
  const { message } = req.body;

  let action = null;

  if (message.toLowerCase().includes("light on")) {
    action = "LIGHT_ON";
  } else if (message.toLowerCase().includes("light off")) {
    action = "LIGHT_OFF";
  }

  res.json({
    action,
    message: "Command processed"
  });
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});