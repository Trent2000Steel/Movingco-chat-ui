export default async function handler(req, res) {
  const messages = req.body?.messages;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ reply: "Missing or invalid messages array." });
  }

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
        messages: messages,
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
