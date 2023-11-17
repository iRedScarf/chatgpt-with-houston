import OpenAI from 'openai';

const apiKey = import.meta.env.OPENAI_API_KEY;
const model = import.meta.env.OPENAI_API_MODEL;

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const openai = new OpenAI({
      apiKey,
    });
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: body.message }],
    });

    console.log("OpenAI Response:", response);

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No choices in response");
    }

    return new Response(JSON.stringify({ answer: response.choices[0].message.content }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('OpenAI request failed:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
};
