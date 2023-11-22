![houston social image](public/social.jpg)
# ChatGPT with HoustonAI

**ChatGPT with HoustonAI** is a minimal web UI for ChatGPT with HoustonAI interface.

Powered by Astro and OpenAI API.

**Note:** This project is for personal, **NON-COMMERCIAL** purposes and is **NOT an OFFICIAL project of the Astro team.**

## Status

This repo is based on [withastro/houston.astro.build](https://github.com/withastro/houston.astro.build). Modifications have been made to the code in `src/pages/api.ts` and `src/util.ts` to enable communication with the OpenAI API within the HoustonAI interface.

Currently, the project does not support rendering streaming responses and custom `System Role`, but these features are planned for future implementation.

## How it works

To be continued...

## Deploy

### Deploy With Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FiRedScarf%2Fchatgpt-with-houston&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20Key&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys)

## Environment Variables

You can control the website through environment variables.

| Name | Description | Default |
| --- | --- | --- |
| `OPENAI_API_KEY` | Your API Key for OpenAI. | `null` |
| `OPENAI_API_MODEL` | ID of the model to use. [List models](https://platform.openai.com/docs/api-reference/models/list) | `gpt-3.5-turbo` |
| `OPENAI_API_BASE_URL` | Custom base url for OpenAI API. | `https://api.openai.com` |

## TODO

- [x] Render text with `Markdown-It`.

- [x] Render mathematical formulas with `KaTeX`.

- [x] Highlight code blocks with `highlight.js`.

- [ ] Copy button for code blocks.

- [x] Support continuous chat.

> HoustonAI will now remember the latest 3 complete conversation histories.

- [ ] Support streaming response for OpenAI API.

- [ ] Implement custom `System Role` functionality.

## Contributing

This project exists thanks to all those who contributed.

Thank you to all our supporters!🙏

[![img](https://contributors.nn.ci/api?repo=iRedScarf/chatgpt-with-houston)](https://github.com/iRedScarf/chatgpt-with-houston/graphs/contributors)

## License

MIT © [Fred K. Schott, Nate Moore, eks](https://github.com/iRedScarf/chatgpt-with-houston/blob/main/LICENSE)
