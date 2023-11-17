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

export function markdown(input: string): string {
  return input
    .replace(
      /(```|~~~)(\w*)([\s\S]+?)\1/g,
      (_1, _2, lang: string, raw: string) => {
        const code = raw
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/`/g, "&#96;");
        const classes = lang ? ` class="language-${lang}"` : "";
        return `<pre><code${classes}>${code.trim()}</code></pre>`;
      }
    )
    .replace(/`([^`\n]*)`/g, (_1, raw) => {
      return raw
        ? `<code>${raw.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>`
        : "";
    })
    .replace(/\*\*(.*?)\*\*/g, (_2, raw) => `<b>${raw}</b>`)
    .replace(/\*(.*?)\*/g, (_3, raw) => `<em>${raw}</em>`);
}
