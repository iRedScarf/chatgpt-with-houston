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

import { createParser } from "eventsource-parser";
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser";
import type { ChatMessage } from "../types";

export const model = import.meta.env.OPENAI_API_MODEL || "gpt-3.5-turbo";

export const generatePayload = (
  apiKey: string,
  messages: ChatMessage[],
  temperature: number,
  sessionId: string
): RequestInit & { dispatcher?: any } => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  method: "POST",
  body: JSON.stringify({
    model,
    messages,
    temperature,
    session_id: sessionId,
    stream: true,
  }),
});

export const parseOpenAIStream = (rawResponse: Response) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  if (!rawResponse.ok) {
    return new Response(rawResponse.body, {
      status: rawResponse.status,
      statusText: rawResponse.statusText,
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {

        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            // response = {
            //   id: 'chatcmpl-6pULPSegWhFgi0XQ1DtgA3zTa1WR6',
            //   object: 'chat.completion.chunk',
            //   created: 1677729391,
            //   model: 'gpt-3.5-turbo-0301',
            //   choices: [
            //     { delta: { content: 'hi' }, index: 0, finish_reason: null }
            //   ],
            // }
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(streamParser);
      for await (const chunk of rawResponse.body as any)
        parser.feed(decoder.decode(chunk));
    },
  });

  return new Response(stream);
};
