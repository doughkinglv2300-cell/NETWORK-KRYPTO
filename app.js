
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chat = document.getElementById("chat");

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.className = "message";
  message.style.marginBottom = "12px";
  message.style.marginLeft = sender === "user" ? "auto" : "0";
  message.style.background =
    sender === "user" ? "#245dcc" : "#202c45";

  message.textContent = text;
  chat.appendChild(message);

  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const prompt = input.value.trim();

  if (!prompt) return;

  addMessage(prompt, "user");
  input.value = "";

  setTimeout(() => {
    addMessage(
      "I'm ready to help! My AI engine is not connected yet. We're building it next.",
      "ai"
    );
  }, 500);
});
