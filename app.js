
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chat = document.getElementById("chat");
const historyBox = document.getElementById("history");
const welcome = document.getElementById("welcome");

const newChatBtn = document.getElementById("new-chat");
const menuBtn = document.getElementById("menu-button");
const closeBtn = document.getElementById("close-sidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebar-overlay");

let conversations = JSON.parse(
  localStorage.getItem("nk_chats") || "[]"
);

let activeId = null;

function saveChats() {
  localStorage.setItem("nk_chats", JSON.stringify(conversations));
}

function createChat() {
  const id = Date.now().toString();

  conversations.unshift({
    id,
    title: "New chat",
    messages: []
  });

  activeId = id;
  saveChats();
  renderChat();
  renderHistory();
  closeSidebar();
  input.focus();
}

function getActiveChat() {
  return conversations.find(item => item.id === activeId);
}

function renderHistory() {
  historyBox.replaceChildren();

  conversations.forEach(item => {
    const button = document.createElement("button");

    button.textContent = item.title;
    button.className = item.id === activeId ? "active" : "";

    button.addEventListener("click", () => {
      activeId = item.id;
      renderChat();
      renderHistory();
      closeSidebar();
    });

    historyBox.appendChild(button);
  });
}

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = "message " + sender;
  message.textContent = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function renderChat() {
  chat.replaceChildren();

  const conversation = getActiveChat();

  if (!conversation || conversation.messages.length === 0) {
    const welcomeCard = document.createElement("div");

    welcomeCard.className = "welcome";
    welcomeCard.innerHTML = `
      <div class="welcome-logo">K</div>
      <h1>What are we building today?</h1>
      <p>Your AI assistant and coding developer.</p>
      <div class="suggestions">
        <button data-prompt="Create a Python project">Create code</button>
        <button data-prompt="Help me debug my code">Debug code</button>
        <button data-prompt="Explain JavaScript">Learn programming</button>
        <button data-prompt="Help me with my GitHub repository">GitHub help</button>
      </div>
    `;

    chat.appendChild(welcomeCard);

    welcomeCard.querySelectorAll("[data-prompt]").forEach(button => {
      button.addEventListener("click", () => {
        input.value = button.dataset.prompt;
        input.focus();
      });
    });

    return;
  }

  conversation.messages.forEach(message => {
    addMessage(message.text, message.sender);
  });
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  if (!activeId) createChat();

  const conversation = getActiveChat();

  conversation.messages.push({
    text,
    sender: "user"
  });

  if (conversation.messages.length === 1) {
    conversation.title = text.slice(0, 35);
  }

  saveChats();
  renderChat();
  renderHistory();

  input.value = "";

  // Temporary response until the secure AI backend is connected.
  setTimeout(() => {
    addMessage(
      "Your message is saved! The real AI engine is coming next. This is still a demo response.",
      "assistant"
    );
  }, 400);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage();
});

input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

newChatBtn.addEventListener("click", createChat);

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

if (conversations.length > 0) {
  activeId = conversations[0].id;
  renderChat();
  renderHistory();
} else {
  renderChat();
      }
