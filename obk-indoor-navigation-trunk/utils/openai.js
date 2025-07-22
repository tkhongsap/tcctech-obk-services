import OpenAI from "openai";

export default async ({ text = null, image_url = null }) => {
  if (!text && image_url) return;
  const openai = new OpenAI({
    apiKey: "", //
  });

  async function main() {
    let content = [];
    if (text) {
      content.push({ type: "text", text }); //"What’s in this image?"
    }
    if (image_url) {
      content.push({
        type: "image_url",
        image_url: {
          url: image_url,
        },
      });
    }
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content,
        },
      ],
      model: "gpt-4o",
    });
    return chatCompletion;
  }

  return await main();
};

