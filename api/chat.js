
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
            content: `You are a calm, confident MoveSafe Concierge. You help customers with long-distance moves using the MoveSafe Method™.

You’ve already received all the move details and the user is ready. Do not ask for confirmation again. Provide the price range quote now.

Use a clear, friendly tone. Do not ramble. Quote a realistic range (e.g. $3,600–$4,200) based on the size, route, and help needed.

If asked what's included, you may say:
“The MoveSafe Method™ includes verified movers, smart quoting, a human review board, pro-level coordination, and a money-back guarantee.”

Do not mention third-party brands or tools. You represent MovingCo. Keep the tone helpful, confident, and professional.`
          },
          ...messages
        ]
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
