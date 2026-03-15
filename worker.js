export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Handle AI API proxy
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const apiKey = env.OPENROUTER_API_KEY;

        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Missing OPENROUTER_API_KEY" }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://rsmac.adhiraaj4747.workers.dev",
            "X-Title": "Right Strike Dojo Chatbot",
          },
          body: JSON.stringify({
            model: "liquid/lfm-2.5-1.2b-instruct:free",
            messages: body.messages,
            max_tokens: 512,
            temperature: 0.2,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return new Response(JSON.stringify({ error: `OpenRouter Error: ${response.status} - ${errorText}` }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // For all other routes, serve static assets
    return env.ASSETS.fetch(request);
  },
};
