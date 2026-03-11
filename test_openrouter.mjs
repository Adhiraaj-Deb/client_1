import 'dotenv/config';

const invokeUrl = "https://openrouter.ai/api/v1/chat/completions";

const headers = {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
};

const payload = {
    "model": "liquid/lfm-2.5-1-point-2b", // Testing model name format, it could also be liquid/lfm-2.5-thinking
    "messages": [{ "role": "user", "content": "hi" }],
    "max_tokens": 100
};

fetch(invokeUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
})
    .then(async response => {
        console.log("HTTP Status:", response.status);
        if (!response.ok) {
            console.error("HTTP error!", await response.text());
        } else {
            const data = await response.json();
            console.log("Success:", JSON.stringify(data));
        }
    })
    .catch(error => console.error("Network error:", error));
