import { createParser } from "eventsource-parser";
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser";
import type { ChatMessage, Provider } from "../types";

// --- Provider configs from environment ---

export const providerConfigs = {
  openai: {
    apiKey: import.meta.env.OPENAI_API_KEY || "",
    model: import.meta.env.OPENAI_API_MODEL || "gpt-3.5-turbo",
    endpoint: (
      import.meta.env.OPENAI_API_ENDPOINT ||
      "https://api.openai.com/v1/chat/completions"
    ).trim().replace(/\/$/, ""),
    label: "OpenAI",
  },
  claude: {
    apiKey: import.meta.env.CLAUDE_API_KEY || "",
    model: import.meta.env.CLAUDE_API_MODEL || "claude-sonnet-4-20250514",
    endpoint: "https://api.anthropic.com/v1/messages",
    label: "Claude",
  },
  gemini: {
    apiKey: import.meta.env.GEMINI_API_KEY || "",
    model: import.meta.env.GEMINI_API_MODEL || "gemini-2.0-flash",
    endpoint: "https://generativelanguage.googleapis.com/v1beta",
    label: "Gemini",
  },
};

// Which providers have API keys configured
export function getAvailableProviders(): Provider[] {
  return (Object.keys(providerConfigs) as Provider[]).filter(
    (p) => !!providerConfigs[p].apiKey
  );
}

// --- Payload generation per provider ---

function extractSystemMessage(messages: ChatMessage[]): {
  system: string;
  userMessages: ChatMessage[];
} {
  const systemMsgs = messages.filter((m) => m.role === "system");
  const userMessages = messages.filter((m) => m.role !== "system");
  const system = systemMsgs.map((m) => m.content).join("\n");
  return { system, userMessages };
}

function generateOpenAIPayload(
  messages: ChatMessage[],
  temperature: number
): { url: string; init: RequestInit } {
  const cfg = providerConfigs.openai;
  return {
    url: cfg.endpoint,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        temperature,
        stream: true,
      }),
    },
  };
}

function generateClaudePayload(
  messages: ChatMessage[],
  temperature: number
): { url: string; init: RequestInit } {
  const cfg = providerConfigs.claude;
  const { system, userMessages } = extractSystemMessage(messages);

  // Claude requires alternating user/assistant. Merge consecutive same-role.
  const merged: { role: string; content: string }[] = [];
  for (const msg of userMessages) {
    const last = merged[merged.length - 1];
    if (last && last.role === msg.role) {
      last.content += "\n" + msg.content;
    } else {
      merged.push({ role: msg.role, content: msg.content });
    }
  }
  // Claude requires first message to be "user"
  if (merged.length > 0 && merged[0].role !== "user") {
    merged.unshift({ role: "user", content: "(conversation continues)" });
  }

  return {
    url: cfg.endpoint,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": cfg.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: cfg.model,
        system,
        messages: merged,
        max_tokens: 8192,
        temperature,
        stream: true,
      }),
    },
  };
}

function generateGeminiPayload(
  messages: ChatMessage[],
  temperature: number
): { url: string; init: RequestInit } {
  const cfg = providerConfigs.gemini;
  const { system, userMessages } = extractSystemMessage(messages);

  const contents = userMessages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const body: any = {
    contents,
    generationConfig: { temperature },
  };
  if (system) {
    body.systemInstruction = { parts: [{ text: system }] };
  }

  const url = `${cfg.endpoint}/models/${cfg.model}:streamGenerateContent?alt=sse&key=${cfg.apiKey}`;

  return {
    url,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  };
}

export function generatePayload(
  provider: Provider,
  messages: ChatMessage[],
  temperature: number
): { url: string; init: RequestInit } {
  switch (provider) {
    case "claude":
      return generateClaudePayload(messages, temperature);
    case "gemini":
      return generateGeminiPayload(messages, temperature);
    case "openai":
    default:
      return generateOpenAIPayload(messages, temperature);
  }
}

// --- Stream parsing per provider ---

const STREAM_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

function parseOpenAIStream(rawResponse: Response): Response {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.enqueue(encoder.encode("[DONE]"));
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices?.[0]?.delta?.content || "";
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // Skip malformed chunks
          }
        }
      };

      const parser = createParser(streamParser);
      try {
        const reader = rawResponse.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          parser.feed(decoder.decode(value, { stream: true }));
        }
        if (controller.desiredSize !== null) {
          controller.enqueue(encoder.encode("[DONE]"));
          controller.close();
        }
      } catch {
        controller.enqueue(encoder.encode("[STREAM_ERROR]"));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: STREAM_HEADERS });
}

function parseClaudeStream(rawResponse: Response): Response {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          // Claude event types: content_block_delta, message_stop, etc.
          if (event.event === "message_stop") {
            controller.enqueue(encoder.encode("[DONE]"));
            controller.close();
            return;
          }
          if (event.event === "content_block_delta") {
            try {
              const json = JSON.parse(event.data);
              const text = json.delta?.text || "";
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // Skip malformed chunks
            }
          }
        }
      };

      const parser = createParser(streamParser);
      try {
        const reader = rawResponse.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          parser.feed(decoder.decode(value, { stream: true }));
        }
        if (controller.desiredSize !== null) {
          controller.enqueue(encoder.encode("[DONE]"));
          controller.close();
        }
      } catch {
        controller.enqueue(encoder.encode("[STREAM_ERROR]"));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: STREAM_HEADERS });
}

function parseGeminiStream(rawResponse: Response): Response {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          try {
            const json = JSON.parse(data);
            const text =
              json.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // Skip malformed chunks
          }
        }
      };

      const parser = createParser(streamParser);
      try {
        const reader = rawResponse.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          parser.feed(decoder.decode(value, { stream: true }));
        }
        if (controller.desiredSize !== null) {
          controller.enqueue(encoder.encode("[DONE]"));
          controller.close();
        }
      } catch {
        controller.enqueue(encoder.encode("[STREAM_ERROR]"));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: STREAM_HEADERS });
}

export function parseStream(
  provider: Provider,
  rawResponse: Response
): Response {
  if (!rawResponse.ok) {
    return new Response(rawResponse.body, {
      status: rawResponse.status,
      statusText: rawResponse.statusText,
    });
  }

  switch (provider) {
    case "claude":
      return parseClaudeStream(rawResponse);
    case "gemini":
      return parseGeminiStream(rawResponse);
    case "openai":
    default:
      return parseOpenAIStream(rawResponse);
  }
}
