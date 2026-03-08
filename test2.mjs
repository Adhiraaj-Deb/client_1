const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";

const headers = {
    "Authorization": "Bearer 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",
    "Accept": "application/json",
    "Content-Type": "application/json"
};

const payload = {
    "model": "moonshotai/kimi-k2.5",
    "messages": [{ "role": "user", "content": "hi" }],
    "max_tokens": 100,
    "temperature": 1.00,
    "top_p": 1.00,
    "stream": false
};

// Test proxy 1: Empty (Original failing)
// Test proxy 2: corsproxy.io (Timeout)
// Test proxy 3: AllOrigins
const proxyUrl = "https://api.allorigins.win/raw?url=";

console.log("Fetching NVIDIA Kimi API...");
fetch(proxyUrl + invokeUrl, {
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
