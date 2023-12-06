import MarkdownIt from "markdown-it";
import mdHighlight from "markdown-it-highlightjs";
import mdKatex from "markdown-it-katex";

const md = MarkdownIt({
  linkify: true,
  breaks: true,
})
  .use(mdKatex)
  .use(mdHighlight);

function markdown(input: string): string {
  return md.render(input);
}

export default markdown;