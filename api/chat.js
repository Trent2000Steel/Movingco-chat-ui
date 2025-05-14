
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const sendSound = document.getElementById('send-sound');
const botSound = document.getElementById('bot-sound');
const ctaSound = document.getElementById('cta-sound');

let chatHistory = [];
let stage = 0;
let quoteRevealed = false;

const questions = [
  "Got it. How many bedrooms are we working with?",
  "And where are you moving from? (Just the city or zip is fine.)",
  "Where are you headed? (City or zip works here too.)",
  "When are you planning to move?",
  "Do you need help with loading, unloading, or both?",
  "Last thing—are there any special or fragile items that matter to you? (Like a piano, safe, art, or antiques?)"
];

function appendMessage(text, sender = 'bot') {
  const msg = document.createElement('div');
  msg.className = sender;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  if (sender === 'bot') botSound.play();
}

function handleAIFlow() {
  if (stage < questions.length) {
    setTimeout(() => {
      appendMessage(questions[stage]);
      stage++;
    }, 500);
  } else if (!quoteRevealed) {
    setTimeout(() => {
      appendMessage("Here’s what I’ve got for your move so far:");
      appendMessage(`• Size: ${chatHistory[0]}
• From: ${chatHistory[1]}
• To: ${chatHistory[2]}
• Move date: ${chatHistory[3]}
• Service: ${chatHistory[4]}
• Special item(s): ${chatHistory[5] || 'None'}`);

      const trustMessages = [
        "Checking recent route history and fuel rates…",
        "Filtering movers who’ve completed similar routes with 4.5+ ratings…",
        "Looking at past 90 days of pricing data for similar moves…"
      ];
      trustMessages.forEach((msg, i) => {
        setTimeout(() => appendMessage(msg), 1000 * (i + 1));
      });

      setTimeout(() => {
        appendMessage("Your estimated price range is between $4,600 and $5,200.");
        const ctaBtn = document.createElement('button');
        ctaBtn.textContent = "Show Me How It Works";
        ctaBtn.onclick = () => {
          if (!quoteRevealed) {
            ctaSound.play();
            quoteRevealed = true;
            appendMessage("Here’s how we work:");
            appendMessage("• Verified movers with proven track records\n• Flat-rate pricing confirmed after we review your photos\n• A concierge coordinator to guide every step\n• Pre-move photo review so the crew shows up prepared\n• Ongoing support before, during, and after your move");

            setTimeout(() => {
              const reserveBtn = document.createElement('button');
              reserveBtn.textContent = "Reserve My Move for $85";
              reserveBtn.onclick = () => {
                appendMessage("Awesome. We’ll collect your info and get your call scheduled.");
                // Placeholder for Stripe or confirmation flow
              };
              chatMessages.appendChild(reserveBtn);
            }, 1000);
          }
        };
        chatMessages.appendChild(ctaBtn);
      }, 4500);
    }, 1000);
  }
}

sendBtn.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  sendSound.play();
  chatHistory.push(message);
  userInput.value = '';

  handleAIFlow();

  // Optional API call if you want to pass history to OpenAI later
  // const response = await fetch('/api/chat', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ messages: chatHistory })
  // });
  // const data = await response.json();
  // appendMessage(data.reply || "OK, let's keep going...");
});
