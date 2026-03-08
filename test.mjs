const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = false;

const headers = {
    "Authorization": "Bearer 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",
    "Accept": "application/json",
    "Content-Type": "application/json"
};

const payload = {
    "model": "moonshotai/kimi-k2.5",
    "messages": [{ "role": "user", "content": "what is 2+2?" }],
    "max_tokens": 100,
    "temperature": 1.00,
    "top_p": 1.00,
    "stream": stream,
};

fetch(invokeUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
})
    .then(async response => {
        if (!response.ok) {
            console.error("HTTP error!", response.status, await response.text());
        } else {
            const data = await response.json();
            console.log("Success:", JSON.stringify(data));
        }
    })
    .catch(error => console.error("Network error:", error));
