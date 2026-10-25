import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";

Chatbot.init({
  // chatflowid: "f1900416-283c-4c41-86ef-99475b153431",
  chatflowid: "cb6105a0-d17f-4faa-9c1d-d5c4c899c6a0",
  apiHost: "https://flowise.diyprefab.com",
  chatflowConfig: {
    /* Chatflow Config */
    // Example: set the model to use for the chatflow
    // model: "gpt-4o",
  },
  observersConfig: {
    /* Observers Config */
  },
  theme: {
    button: {
      backgroundColor: "#0a2b2d",
      right: 20,
      bottom: 20,
      size: 58,
      dragAndDrop: true,
      iconColor: "white",
      customIconSrc: "https://s3.diyprefab.com/chatscript/chat/diyva.png",
      autoWindowOpen: {
        autoOpen: false,
        openDelay: 2,
        autoOpenOnMobile: false,
      },
    },
    disclaimer: {
      title: "Disclaimer",
      message:
        'By using this chatbot, you agree to the <a target="_blank" href="https://diyprefab.com/terms">Terms & Condition</a>',
      textColor: "black",
      buttonColor: "#001524",
      buttonText: "Start Chatting",
      buttonTextColor: "white",
      denyButtonBgColor: "#6c757d",
      denyButtonText: "Cancel",
      blurredBackgroundColor: "rgba(0, 0, 0, 0.4)",
      backgroundColor: "white",
    },
    customCSS: `
            .scrollable-container {
                scrollbar-width: thin !important;
                -ms-overflow-style: none !important;
            }
            
            .flowise-scroll-down {
                display: none;
                justify-content: center;
                margin-bottom: 10px;
            }
            
            .flowise-scroll-down.visible {
                display: flex;
            }
            
            .flowise-scroll-down button {
                background-color: rgba(10, 43, 45, 0.9);
                border: none;
                border-radius: 9999px;
                color: #ffffff;
                cursor: pointer;
                font-size: 18px;
                height: 36px;
                line-height: 1;
                width: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
                transition: transform 0.2s ease, opacity 0.2s ease;
            }
            
            .flowise-scroll-down button:hover {
                transform: translateY(1px);
                opacity: 0.9;
            }
            
            /* For Webkit browsers (Chrome, Safari, Edge) */
            .scrollable-container::-webkit-scrollbar {
                width: 6px !important;
            }
            
            .scrollable-container::-webkit-scrollbar-track {
                background: transparent !important;
            }
            
            .scrollable-container::-webkit-scrollbar-thumb {
                background-color: #c1c1c1 !important;
                border-radius: 3px !important;
            }
            
            .scrollable-container::-webkit-scrollbar-thumb:hover {
                background-color: #a8a8a8 !important;
            }
        `,
    chatWindow: {
      showTitle: true,
      showAgentMessages: true,
      title: "DIY-VA",
      titleAvatarSrc: "https://s3.diyprefab.com/chatscript/chat/diyva.png",
      welcomeMessage: "Welcome to DIY-Prefab!",
      errorMessage: "This is a custom error message",
      backgroundColor: "#f3f1ea",
      backgroundImage: "enter image path or link",
      // Compute 60% of viewport height in pixels to avoid Flowise unit issues
      height:
        typeof window !== "undefined"
          ? Math.round(window.innerHeight * 0.7)
          : 700,
      width: 480,
      fontSize: 14,
      starterPrompts: [
        "Explore engineering solutions.",
        "Partner with our engineering and design specialists",
        "Unlock technical consulting",
        "Plan resilient infrastructure",
      ],
      starterPromptFontSize: 15,
      clearChatOnReload: false,
      sourceDocsTitle: "Sources:",
      renderHTML: true,
      botMessage: {
        backgroundColor: "#dbd9d3",
        textColor: "#303235",
        showAvatar: true,
        avatarSrc: "https://s3.diyprefab.com/chatscript/chat/diyva.png",
      },
      userMessage: {
        backgroundColor: "#0a2b2d",
        textColor: "#ffffff",
        showAvatar: false,
        avatarSrc:
          "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
      },
      textInput: {
        placeholder: "Type your question",
        backgroundColor: "#ffffff",
        textColor: "#303235",
        sendButtonColor: "#0a2b2d",
        maxChars: 250,
        maxCharsWarningMessage:
          "Character limit exceeded. Please input less than 250 characters.",
        autoFocus: true,
        sendMessageSound: true,
        sendSoundLocation: "send_message.mp3",
        receiveMessageSound: true,
        receiveSoundLocation: "receive_message.mp3",
      },
      feedback: {
        color: "#303235",
      },
      dateTimeToggle: {
        date: true,
        time: true,
      },
      footer: {
        textColor: "#303235",
        text: "Powered by ",
        company: "Ai-Prefab",
        companyLink: "https://aiprefab.in/",
      },
    },
  },
});

const attachScrollDownControl = () => {
  const messageContainer = document.querySelector(".scrollable-container");
  const inputContainer = document.querySelector(".w-full.px-5.pt-2.pb-1");

  if (!messageContainer || !inputContainer) {
    return false;
  }

  if (document.querySelector(".flowise-scroll-down")) {
    return true;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "flowise-scroll-down";

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", "Scroll to latest messages");
  button.textContent = "\u25BC";

  wrapper.appendChild(button);
  inputContainer.parentNode.insertBefore(wrapper, inputContainer);

  const scrollToBottom = () => {
    messageContainer.scrollTo({
      top: messageContainer.scrollHeight,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    const distanceFromBottom =
      messageContainer.scrollHeight -
      messageContainer.scrollTop -
      messageContainer.clientHeight;
    const isAtBottom = distanceFromBottom <= 4;
    wrapper.classList.toggle("visible", !isAtBottom);
  };

  button.addEventListener("click", () => {
    scrollToBottom();
  });

  messageContainer.addEventListener("scroll", toggleVisibility);

  const contentObserver = new MutationObserver(() => {
    toggleVisibility();
  });

  contentObserver.observe(messageContainer, { childList: true, subtree: true });

  toggleVisibility();
  return true;
};

const waitForChatWindow = () => {
  if (attachScrollDownControl()) {
    return;
  }

  const observer = new MutationObserver(() => {
    if (attachScrollDownControl()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", waitForChatWindow);
} else {
  waitForChatWindow();
}
