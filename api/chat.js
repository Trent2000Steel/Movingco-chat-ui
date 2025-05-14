import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a calm, confident, and professional moving concierge. Your job is to put the customer at ease, ask the right follow-up questions, and provide a quote estimate when ready. Speak naturally, like a real person, not a chatbot." },
        ...messages
      ],
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to generate chat response" });
  }
}
