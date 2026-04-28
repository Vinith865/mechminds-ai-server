const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ROOT
app.get("/", (req, res) => {
  res.send("🚀 Server running (no API)");
});

// CHAT
app.post("/chat", (req, res) => {

  const message = req.body.message || "";

  let reply = "";

  if (message.toLowerCase().includes("iot")) {
    reply = "IoT stands for Internet of Things. It connects devices to the internet.";
  } else if (message.toLowerCase().includes("ai")) {
    reply = "AI stands for Artificial Intelligence. It allows machines to learn and think.";
  } else {
    reply = "You said: " + message;
  }

  const audio =
    "https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=" +
    encodeURIComponent(reply);

  res.json({
    reply: reply,
    audio: audio
  });
});

// START
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
