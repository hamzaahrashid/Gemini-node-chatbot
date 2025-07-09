const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config(); // Load .env file

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;
console.log("🔑 Loaded API Key:", API_KEY); // Debugging API key

app.post("/gemini-chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                })
            }
        );

        const result = await response.json();
        console.log("🔥 Full API Response:", JSON.stringify(result, null, 2)); // Log response

        const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
        res.json({ reply });

    } catch (error) {
        console.error("❌ Error fetching response:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/", (req, res) => {
    res.send("✅ Server is running!");
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
