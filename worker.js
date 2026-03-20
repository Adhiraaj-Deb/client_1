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

        // Try multiple free models in order for resilience
        const models = [
          "meta-llama/llama-3.3-70b-instruct:free",
          "liquid/lfm-2.5-1.2b-instruct:free",
          "mistralai/mistral-7b-instruct:free",
        ];

        let lastError = null;
        for (const model of models) {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://rsmac.adhiraaj4747.workers.dev",
              "X-Title": "Right Strike Dojo Chatbot",
            },
            body: JSON.stringify({
              model: model,
              messages: body.messages,
              max_tokens: 512,
              temperature: 0.2,
            }),
          });

          const data = await response.json();

          // If rate limited (429) or upstream error, try next model
          if (response.status === 429 || (data.error && data.error.code === 429)) {
            lastError = data.error || { message: "Rate limited" };
            continue;
          }

          // If other non-ok response (e.g. 401 auth error), return simplified error
          if (!response.ok || data.error) {
            const statusCode = response.status;
            return new Response(JSON.stringify({ error: `API_ERROR_${statusCode}` }), {
              status: 500,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            });
          }

          // Success!
          return new Response(JSON.stringify(data), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        }

        // All models failed or rate limited
        return new Response(JSON.stringify({ error: "API_ALL_MODELS_BUSY" }), {
          status: 429,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
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
