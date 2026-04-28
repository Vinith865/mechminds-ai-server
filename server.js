require("dotenv").config();

const express = require("express");
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

    let reply = "";

    const msg = message.toLowerCase();

    // ===== SIMPLE AI LOGIC =====
    if (msg.includes("iot")) {
      reply = "IoT stands for Internet of Things. It connects devices like sensors and machines to the internet so they can communicate and share data.";
    } 
    else if (msg.includes("ai")) {
      reply = "AI stands for Artificial Intelligence. It allows machines to learn from data and make decisions like humans.";
    } 
    else if (msg.includes("robot")) {
      reply = "A robot is a programmable machine that can perform tasks automatically.";
    }
    else {
      reply = "You asked: " + message + ". I am your MechMinds AI assistant.";
    }

    // ===== AUDIO =====
    const audioURL =
      "https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=" +
      encodeURIComponent(reply);

    res.json({
      reply,
      audio: audioURL
    });

  } catch (err) {
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
