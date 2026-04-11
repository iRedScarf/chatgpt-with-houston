import {
  generatePayload,
  parseStream,
  providerConfigs,
  getAvailableProviders,
} from "../utils/generate";
import type { APIRoute } from "astro";
import type { Provider } from "../types";

export const prerender = false;

export const GET: APIRoute = async () => {
  const available = getAvailableProviders();
  const providers = available.map((p) => ({
    id: p,
    label: providerConfigs[p].label,
    model: providerConfigs[p].model,
  }));
  return new Response(JSON.stringify({ providers }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { messages, temperature, provider: rawProvider } = body;

    if (!messages) {
      return new Response(
        JSON.stringify({ error: { message: "No input text." } }),
        { status: 400 }
      );
    }

    const provider: Provider =
      rawProvider === "claude" || rawProvider === "gemini"
        ? rawProvider
        : "openai";

    const cfg = providerConfigs[provider];
    if (!cfg.apiKey) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NoApiKey",
            message: `API key for ${cfg.label} is not configured.`,
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { url, init } = generatePayload(provider, messages, temperature);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    let response: Response;
    try {
      response = await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `${cfg.label} API error ${response.status}: ${errorBody || response.statusText}`
      );
    }

    return parseStream(provider, response);
  } catch (err: any) {
    console.error("Error processing request:", err);

    const isTimeout =
      err.name === "AbortError" || err.message?.includes("abort");

    return new Response(
      JSON.stringify({
        error: {
          code: isTimeout ? "Timeout" : err.name || "UnknownError",
          message: isTimeout
            ? "Request timed out. Please try again."
            : err.message || "An unknown error occurred",
        },
      }),
      {
        status: isTimeout ? 504 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
