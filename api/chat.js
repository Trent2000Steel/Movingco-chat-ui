document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");

  const messages = [
    {
      role: "system",
      content:
        "You are a calm, confident, professional moving concierge. Make the customer feel at ease. Ask follow-up questions before quoting. Sound like a real human, not a bot.",
    },
  ];

  function appendMessage(text, sender = "bot") {
    const msg = document.createElement("div");
    msg.className = sender;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function sendToGPT() {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json();
      if (data.reply) {
        messages.push({ role: "assistant", content: data.reply });
        appendMessage(data.reply, "bot");
      } else {
        appendMessage("No response from assistant.", "bot");
      }
    } catch (err) {
      appendMessage("Error talking to assistant.", "bot");
    }
  }

  sendBtn.addEventListener("click", async () => {
    const input = userInput.value.trim();
    if (!input) return;
    appendMessage(input, "user");
    messages.push({ role: "user", content: input });
    userInput.value = "";
    await sendToGPT();
  });

  // Optional welcome message
  appendMessage("No forms. No waiting. Just tell me about your move.");
});
