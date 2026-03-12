// Cloudflare Pages Function for API Proxy
export async function onRequestPost({ request, env }) {
    try {
        const body = await request.json();

        // The OPENROUTER_API_KEY must be set in Cloudflare's dashboard settings
        const AI_CHATBOT_API_KEY = env.OPENROUTER_API_KEY;

        if (!AI_CHATBOT_API_KEY) {
            throw new Error("Missing OPENROUTER_API_KEY in environment variables");
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${AI_CHATBOT_API_KEY}`,
                "Content-Type": "application/json",
                // Cloudflare handles headers safely server-side
                "HTTP-Referer": "https://synalpy.vercel.app", // Consider updating this to actual site URL
                "X-Title": "Right Strike Dojo Chatbot"
            },
            body: JSON.stringify({
                model: "liquid/lfm-2.5-1.2b-instruct:free",
                messages: body.messages,
                max_tokens: 512,
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Return JSON response with CORS headers
        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Allows any origin, fine for serverless functions
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        });

    } catch (error) {
        console.error("Proxy Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
}

// Handle preflight OPTIONS request for CORS
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
        }
    });
}
