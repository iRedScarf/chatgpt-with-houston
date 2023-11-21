![houston social image](public/social.jpg)
# ChatGPT with HoustonAI

**ChatGPT with HoustonAI** is a minimal web UI for ChatGPT with HoustonAI interface.

Powered by Astro and OpenAI API.

**Note:** This project is for personal, **NON-COMMERCIAL** purposes and is **NOT an official project of the Astro team.**

## Status

This repo is forked from [withastro/houston.astro.build](https://github.com/withastro/houston.astro.build).

Based on the front-end page code of [houston.astro.build](https://houston.astro.build), and has modified the code in the `src/pages/api.ts` and `src/util.ts` to enable communication with the OpenAI API within the HoustonAI UI.

Currently, the project does not support rendering streaming responses and custom `System Role`, but these features are planned for future implementation.

## How it works

To be continued...

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FiRedScarf%2Fchatgpt-with-houston&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20Key&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys)

## TODO

- [x] Render text with `Markdown-It`.

- [x] Render mathematical formulas with `KaTeX`.

- [x] Highlight code blocks with `highlight.js`.

- [ ] Copy button for code blocks.

- [x] Support continuous chat.

> HoustonAI will now remember the latest 3 complete conversation histories.

- [ ] Support streaming response for OpenAI API.

- [ ] Implement custom `System Role` functionality.
