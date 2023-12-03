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

import { fetch } from 'undici'
import { generatePayload, parseOpenAIStream } from '../utils/generate'
import type { APIRoute } from 'astro'

const apiKey = import.meta.env.OPENAI_API_KEY
const apiEndpoint = ((import.meta.env.OPENAI_API_ENDPOINT) || 'https://api.openai.com/v1/chat/completions').trim().replace(/\/$/, '')
const temperature = parseFloat(import.meta.env.OPENAI_TEMPERATURE) || 0.7;

export const POST: APIRoute = async(context) => {
  const body = await context.request.json()
  const { messages, time, temperature } = body
  if (!messages) {
    return new Response(JSON.stringify({
      error: {
        message: 'No input text.',
      },
    }), { status: 400 })
  }

  const initOptions = generatePayload(apiKey, messages, temperature)

  const response = await fetch(apiEndpoint, initOptions).catch((err: Error) => {
    console.error("Error processing request:", err);
    return new Response(JSON.stringify({
      error: {
        code: err.name,
        message: err.message,
      },
    }), { status: 500 })
  }) as Response

  return parseOpenAIStream(response) as Response
}
