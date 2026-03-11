import 'dotenv/config';

async function test() {
    const key = process.env.OPENROUTER_API_KEY;
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "liquid/lfm-2.5-1.2b-instruct:free",
                messages: [{ role: "user", content: "hi" }]
            })
        });
        const status = response.status;
        const text = await response.text();
        console.log(`Status: ${status}`);
        console.log(`Response: ${text}`);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

test();
