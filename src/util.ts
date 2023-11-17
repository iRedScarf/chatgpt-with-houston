import MarkdownIt from 'markdown-it';

export async function makeAskRequest(message: string): Promise<any> {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
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

const md = new MarkdownIt();

export function markdown(input: string): string {
  return md.render(input);
}
