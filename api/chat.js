export default async function handler(req, res) {
  const { messages } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ reply: "Missing API key" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a calm, confident MoveSafe Concierge. Your job is to guide people through long-distance moves using the MoveSafe Method™.

Collect the following info step by step:
1. Where they're moving from (origin city)
2. Where they're moving to (destination city)
3. Size of the move (e.g. 2-bedroom house)
4. Move date or timing
5. Whether they need help loading, unloading, or both
6. Any special or fragile items (repeat the item name)

Once all info is gathered, repeat it back in a clean summary. Example:
"Thanks for that. So you're moving from Dallas to Phoenix, around July 15th, for a 2-bedroom apartment. You'll need help loading and unloading, and you mentioned a piano that requires special care. If that all looks good, are you ready for your quote?"

Don't quote until you're sure you have these 6 points. Then say you’ll run the numbers and prepare a price range. DO NOT mention U-Pack or any tools.`
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.choices || !data.choices.length) {
      throw new Error("No reply from OpenAI");
    }

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ reply: "Error: " + err.message });
  }
}
