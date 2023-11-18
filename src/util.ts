import MarkdownIt from 'markdown-it';
import mdHighlight from 'markdown-it-highlightjs';
import mdKatex from 'markdown-it-katex';

export async function makeAskRequest(message: string, history: Array<any>): Promise<any> {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Request to API failed:', error);
    return { error: 'Request to API failed'};
  }
}

const md = MarkdownIt({
  linkify: true,
  breaks: true,
}).use(mdKatex).use(mdHighlight)

export function markdown(input: string): string {
  return md.render(input);
}
