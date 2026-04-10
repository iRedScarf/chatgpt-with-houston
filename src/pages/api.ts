// MIT License

// Copyright (c) 2023-present, Diu

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { generatePayload, parseOpenAIStream } from "../utils/generate";
import type { APIRoute } from "astro";

export const prerender = false;

const apiKey = import.meta.env.OPENAI_API_KEY;
const apiEndpoint = (
  import.meta.env.OPENAI_API_ENDPOINT ||
  "https://api.openai.com/v1/chat/completions"
)
  .trim()
  .replace(/\/$/, "");

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { messages, temperature, sessionId } = body;
    if (!messages) {
      return new Response(
        JSON.stringify({
          error: { message: "No input text." },
        }),
        { status: 400 }
      );
    }

    const initOptions = generatePayload(apiKey, messages, temperature, sessionId);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    let response: Response;
    try {
      response = await fetch(apiEndpoint, {
        ...initOptions,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `OpenAI API error ${response.status}: ${errorBody || response.statusText}`
      );
    }

    return parseOpenAIStream(response);
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
