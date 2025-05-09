export default async function handler(req, res) {
  const { prompt } = await req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful moving concierge for MovingCo. You follow the MoveSafe Method™ to coordinate long-distance moves with flat-rate pricing and elite service." },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices?.[0]?.message?.content || "[No response]" });
}
