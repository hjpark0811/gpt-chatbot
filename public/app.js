async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value;

  if (!message.trim()) return;

  chatBox.innerText += `👤 You: ${message}\n`;
  input.value = "";

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  chatBox.innerText += `🤖 GPT: ${data.reply}\n`;
}
