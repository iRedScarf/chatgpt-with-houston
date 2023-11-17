![houston social image](public/social.jpg)
# ChatGPT with HoustonAI

**ChatGPT with HoustonAI** is a minimal web UI for ChatGPT with HoustonAI interface. It is powered by Astro and OpenAI API.

## Status

This repo is forked from [withastro/houston.astro.build](https://github.com/withastro/houston.astro.build).

Based on the front-end page code of [withastro/houston.astro.build](https://github.com/withastro/houston.astro.build), and has modified the code in the `src/pages/api.ts` and `src/util.ts` to enable communication with the OpenAI API within the HoustonAI UI.

Currently, it only supports single-session chat with the OpenAI API, but I plan to upgrade it to support continuous chat in the future.

At present, it has poor support for rendering the information returned by the OpenAI API, but this will be improved in future updates.

## How it works

To be continued...

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FiRedScarf%2Fchatgpt-with-houston&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20Key&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys)
