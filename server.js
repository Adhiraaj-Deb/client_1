const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve the frontend files like index.html

const AI_CHATBOT_API_KEY = "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";

app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${AI_CHATBOT_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Right Strike Dojo Chatbot"
            },
            body: JSON.stringify({
                model: "liquid/lfm-2.5-1.2b-instruct:free",
                messages: req.body.messages,
                max_tokens: 512,
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
