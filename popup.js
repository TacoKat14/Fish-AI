const input =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const chat =
    document.getElementById("chat");


// =========================
// ADD MESSAGE
// =========================

function addMessage(text, type) {

    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;


    if (type === "ai") {

        const avatar =
            document.createElement("div");

        avatar.className =
            "avatar";

        avatar.textContent =
            "🐟";

        message.appendChild(avatar);
    }


    const bubble =
        document.createElement("div");

    bubble.className =
        "bubble";


    if (type === "ai") {

        const name =
            document.createElement("div");

        name.className =
            "bubble-name";

        name.textContent =
            "FishAI";

        bubble.appendChild(name);
    }


    const textElement =
        document.createElement("div");

    textElement.className =
        "bubble-text";

    textElement.textContent =
        text;

    bubble.appendChild(
        textElement
    );


    message.appendChild(
        bubble
    );

    chat.appendChild(
        message
    );


    chat.scrollTop =
        chat.scrollHeight;
}


// =========================
// SEND MESSAGE
// =========================

async function sendMessage() {

    const message =
        input.value.trim();

    if (!message) {
        return;
    }


    addMessage(
        message,
        "user"
    );


    input.value = "";

    input.disabled = true;

    sendButton.disabled = true;


    // =========================
    // THINKING
    // =========================

    const loading =
        document.createElement("div");

    loading.className =
        "message ai";


    const avatar =
        document.createElement("div");

    avatar.className =
        "avatar";

    avatar.textContent =
        "🐟";


    const bubble =
        document.createElement("div");

    bubble.className =
        "bubble thinking-bubble";


    const fish =
        document.createElement("span");

    fish.className =
        "thinking-fish";

    fish.textContent =
        "🐟";


    const text =
        document.createElement("span");

    text.textContent =
        "Thinking";


    const dot1 =
        document.createElement("span");

    dot1.className =
        "thinking-dot";

    dot1.textContent =
        ".";


    const dot2 =
        document.createElement("span");

    dot2.className =
        "thinking-dot";

    dot2.textContent =
        ".";


    const dot3 =
        document.createElement("span");

    dot3.className =
        "thinking-dot";

    dot3.textContent =
        ".";


    bubble.appendChild(fish);
    bubble.appendChild(text);
    bubble.appendChild(dot1);
    bubble.appendChild(dot2);
    bubble.appendChild(dot3);

    loading.appendChild(avatar);
    loading.appendChild(bubble);

    chat.appendChild(loading);


    chat.scrollTop =
        chat.scrollHeight;


    // =========================
    // SERVER
    // =========================

    try {

        const response =
            await fetch(
                "https://fish-ai-xpox.onrender.com/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            message: message
                        })
                }
            );


        const data =
            await response.json();


        loading.remove();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Server error"
            );
        }


        addMessage(
            data.reply,
            "ai"
        );


    } catch (error) {

        console.error(
            "FishAI error:",
            error
        );


        loading.remove();


        addMessage(
            "❌ I couldn't connect to FishAI. Please try again.",
            "ai"
        );


    } finally {

        input.disabled = false;

        sendButton.disabled = false;

        input.focus();

    }
}


// =========================
// SEND BUTTON
// =========================

sendButton.addEventListener(
    "click",
    sendMessage
);


// =========================
// ENTER
// =========================

input.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }

    }
);


// =========================
// SETTINGS
// =========================

const settingsButton =
    document.getElementById(
        "settingsButton"
    );

const settingsPanel =
    document.getElementById(
        "settingsPanel"
    );

const closeSettings =
    document.getElementById(
        "closeSettings"
    );

const themeSelect =
    document.getElementById(
        "themeSelect"
    );

const backgroundSelect =
    document.getElementById(
        "backgroundSelect"
    );


settingsButton.addEventListener(
    "click",
    () => {

        settingsPanel.classList.add(
            "open"
        );

    }
);


closeSettings.addEventListener(
    "click",
    () => {

        settingsPanel.classList.remove(
            "open"
        );

    }
);


// =========================
// THEME
// =========================

themeSelect.addEventListener(
    "change",
    () => {

        const theme =
            themeSelect.value;

        document.body.classList.remove(
            "light",
            "dark"
        );

        document.body.classList.add(
            theme
        );

        localStorage.setItem(
            "fishAITheme",
            theme
        );

    }
);


// =========================
// BACKGROUND
// =========================

backgroundSelect.addEventListener(
    "change",
    () => {

        const background =
            backgroundSelect.value;

        document.body.classList.remove(
            "bg-ocean",
            "bg-deepsea",
            "bg-tropical",
            "bg-river",
            "bg-minimal"
        );

        document.body.classList.add(
            `bg-${background}`
        );

        localStorage.setItem(
            "fishAIBackground",
            background
        );

    }
);


// =========================
// LOAD SETTINGS
// =========================

const savedTheme =
    localStorage.getItem(
        "fishAITheme"
    ) || "dark";

const savedBackground =
    localStorage.getItem(
        "fishAIBackground"
    ) || "ocean";


document.body.classList.add(
    savedTheme
);

document.body.classList.add(
    `bg-${savedBackground}`
);


themeSelect.value =
    savedTheme;

backgroundSelect.value =
    savedBackground;