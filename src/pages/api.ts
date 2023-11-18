import OpenAI from 'openai';

const apiKey = import.meta.env.OPENAI_API_KEY;
const model = import.meta.env.OPENAI_API_MODEL || 'gpt-3.5-turbo';

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const openai = new OpenAI({
      apiKey,
    });
    const messages = [
      {
        role: "system",
        content: "You are HoustonAI, a helpful assistant based on OpenAI API."
      },
      ...body.history,
      {
        role: "user",
        content: body.message
      }
    ];

    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });

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
