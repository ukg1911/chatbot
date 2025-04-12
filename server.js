// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { marked } from "marked";

dotenv.config();

const app = express();
const PORT = 3000;
const apiKey = process.env.API_KEY;

app.use(express.static("public"));
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    let botReply = "No response from API";

    if (data?.choices?.[0]?.message?.content) {
    botReply = data.choices[0].message.content;
    }

    const htmlResponse = marked(botReply);
    res.json({ botResponse: botReply, htmlResponse });
    
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
