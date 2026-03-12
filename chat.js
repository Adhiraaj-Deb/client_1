const chatbotWidget = document.getElementById('ai-chatbot-widget');
const chatWindow = document.getElementById('ai-chat-window');
const closeBtn = document.querySelector('.ai-chat-close');
const chatInput = document.getElementById('ai-chat-input');
const sendBtn = document.getElementById('ai-chat-send');
const messagesContainer = document.getElementById('ai-chat-messages');

let isChatOpen = false;

// --- Rate Limiting Strategy ---
// To prevent basic abuse, we'll implement a simple client-side rate limit.
// Max 5 messages per minute.
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_MESSAGES_PER_WINDOW = 5;
let messageTimestamps = [];

function checkRateLimit() {
    const now = Date.now();
    // Remove timestamps older than the window
    messageTimestamps = messageTimestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);

    if (messageTimestamps.length >= MAX_MESSAGES_PER_WINDOW) {
        return false; // Rate limited
    }

    messageTimestamps.push(now);
    return true; // Allowed
}

// --- Topic Firewall / Refusal Logic ---
const REFUSAL_MESSAGE = "I cannot help you with that, but I can help you with information regarding our fees, programs, and schedules!";

function isOffTopic(text) {
    const lowerText = text.toLowerCase();

    // 1. Blacklisted Names / Figures (Celebrities, historical figures, etc.)
    const blacklistedNames = [
        "johnny sins", "osama bin laden", "donald trump", "elon musk", "putin", "hitler",
        "celebrity", "actor", "pope", "president"
    ];
    if (blacklistedNames.some(name => lowerText.includes(name))) return true;

    // 2. Off-topic Categories (Coding, Recipes, Science, History, Math)
    const offTopicKeywords = [
        "python", "javascript", "script", "code", "recipe", "cook", "pancake",
        "capital of", "who is the prime minister", "history of", "how to build a",
        "solve", "equation", "math", "biology", "physics", "chemistry"
    ];
    if (offTopicKeywords.some(kw => lowerText.includes(kw))) return true;

    // 3. Personal Statements / Feelings (Unrelated to dojo)
    const personalFeelings = [
        "my head hurts", "i am sad", "i am angry", "i love you", "marry me",
        "i am bored", "tell me a joke", "i feel", "my dog", "my cat"
    ];
    if (personalFeelings.some(feeling => lowerText.includes(feeling))) return true;

    // 4. Common Jailbreak / Persona Triggers
    const jailbreakTriggers = [
        "ignore previous instructions", "disregard all rules", "act as", "pretend to be",
        "imagine a world", "system prompt", "who made you", "what model", "liquid", "lfm"
    ];
    if (jailbreakTriggers.some(trigger => lowerText.includes(trigger))) return true;

    return false;
}

const getPageName = () => {
    const path = window.location.pathname;
    if (path.includes('gallery.html')) return "Gallery Page";
    if (path.includes('recognition.html')) return "Club Recognition Page";
    return "Homepage";
};

const systemPrompt = `
You are the official customer service virtual assistant for "Right Strike Martial Arts Club", an authentic Shito-Ryu Karate dojo in Bangalore, Karnataka. 

Current Page Context: The user is currently browsing the ${getPageName()}.

=== CORE RULES ===
1. YOU ARE NOT A GENERAL PURPOSE AI. 
2. IF A QUESTION IS NOT ABOUT THE DOJO, KARATE, OR MARTIAL ARTS, YOU MUST GIVE THE EXACT REFUSAL AND NOTHING ELSE.
3. IF ASKED WHICH PAGE THE USER IS ON, TELL THEM CLEARLY (e.g., "You are on our ${getPageName()}") AND ASK IF THEY NEED HELP WITH THAT SPECIFIC SECTION.
4. DO NOT EXPLAIN WHY YOU ARE REFUSING.
5. IF OFF-TOPIC, REPLY EXACTLY: "I cannot help you with that, but I can help you with information regarding our fees, programs, and schedules!"

=== KNOWLEDGE BASE ===
**About Us:**
- We fuse traditional Japanese martial arts with modern training methodologies.
- Founder and Chief Instructor: Neeraj. He emphasises discipline, respect, and technical excellence.
- Location: Bangalore, Karnataka.
- Contact: +91 90190 72938 | rightstrikemartialartsclub@gmail.com

**Programs & Pricing:**
Two plans:
1. Monthly Plan – Flexible month-to-month billing. Renews automatically.
2. Annual Plan – Best value. One upfront payment, 12 months at a significant discount.

**Benefits:**
- Traditional Discipline, Self-Defence, Fitness, Safe Environment.
**Certificates:**
- Public gallery from January 2025–2026 available on the Recognition page.
`;

// --- Conversation History ---
let conversationHistory = [
    { role: "system", content: systemPrompt }
];

// --- UI Toggling ---
function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWindow.classList.remove('hidden');
        chatInput.focus();
        chatbotWidget.style.transform = 'scale(0)';
    } else {
        chatWindow.classList.add('hidden');
        chatbotWidget.style.transform = 'scale(1)';
    }
}

chatbotWidget.addEventListener('click', toggleChat);
closeBtn.addEventListener('click', toggleChat);

// --- Messaging Logic ---
function addMessageToUI(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if (sender === 'user') {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('bot-message');
    }

    // Basic formatting for bot responses (converting newlines to <br> and bold text)
    let formattedText = text.replace(/\n/g, '<br>');
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    messageDiv.innerHTML = `<p>${formattedText}</p>`;
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

async function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    if (!checkRateLimit()) {
        addMessageToUI('bot', "You're sending messages too fast! Please wait a moment before trying again.");
        return;
    }

    // 1. Add user message to UI
    addMessageToUI('user', text);
    chatInput.value = '';

    // NEW: Client-side Topic Firewall
    if (isOffTopic(text)) {
        setTimeout(() => {
            addMessageToUI('bot', REFUSAL_MESSAGE);
            conversationHistory.push({ role: "assistant", content: REFUSAL_MESSAGE });
        }, 500);
        return;
    }

    // 2. Add to conversation history
    conversationHistory.push({ role: "user", content: text });

    // 3. Show typing indicator
    showTypingIndicator();

    // 4. Call Cloudflare Pages API Endpoint
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cloudflare Function API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        removeTypingIndicator();

        if (data.choices && data.choices.length > 0) {
            let botReply = data.choices[0].message.content;

            // "Thinking" models often return thought process in 'reasoning' and null in 'content'
            if (!botReply) {
                const reasoning = data.choices[0].message.reasoning;
                if (reasoning) {
                    botReply = "*(Thinking)*\n\n" + reasoning;
                } else {
                    botReply = "I couldn't formulate a proper response at this time. Please try asking differently.";
                }
            }

            // Ensure botReply is a string
            botReply = String(botReply);

            // Add bot reply to UI
            addMessageToUI('bot', botReply);

            // Add to conversation history
            conversationHistory.push({ role: "assistant", content: botReply });
        } else {
            addMessageToUI('bot', "I'm having trouble processing that right now. Please try again or contact us directly at +91 90190 72938.");
        }

    } catch (error) {
        console.error("Chat API Error:", error);
        removeTypingIndicator();
        addMessageToUI('bot', `I'm currently experiencing technical difficulties [Error: ${error.message}]. Please get in touch with us at rightstrikemartialartsclub@gmail.com instead.`);
    }
}

sendBtn.addEventListener('click', handleSendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});
