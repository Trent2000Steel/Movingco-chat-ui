
document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");
  const sendSound = document.getElementById("send-sound");
  const botSound = document.getElementById("bot-sound");

  const messages = [
    {
      role: "system",
      content:
        "You are a calm, confident, and professional moving concierge. Your job is to put the customer at ease, ask the right follow-up questions, and provide a quote estimate when ready. Speak naturally, like a real person, not a chatbot.",
    },
  ];

  function appendMessage(text, sender = "bot") {
    const msg = document.createElement("div");
    msg.className = sender;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (sender === "bot") botSound.play();
  }

  async function sendToGPT() {
    try {
      console.log("Sending to GPT:", messages);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();
      console.log("GPT Response:", data);

      if (data.reply) {
        messages.push({ role: "assistant", content: data.reply });
        appendMessage(data.reply, "bot");
      } else {
        appendMessage("Sorry, no response from GPT.", "bot");
      }
    } catch (err) {
      console.error("Error talking to GPT:", err);
      appendMessage("There was an error talking to the assistant.", "bot");
    }
  }

  sendBtn.addEventListener("click", async () => {
    const input = userInput.value.trim();
    if (!input) return;

    appendMessage(input, "user");
    sendSound.play();
    messages.push({ role: "user", content: input });
    userInput.value = "";

    await sendToGPT();
  });

  // Start the conversation
  appendMessage(
    "No forms. No waiting. I’ll give you a real long-distance price range right here in chat. Just tell me about your move."
  );
});
