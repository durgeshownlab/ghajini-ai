import React, { useEffect, useRef, useState } from "react";
import InputBox from "./components/InputBox/InputBox.js";
import searchForPrompt from "./services/aiService/aiService.js";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/esm/styles/prism";
import playRingtone from "./services/ringtoneService/ringtoneService.js";
import { CodeProps } from "react-markdown/lib/ast-to-react";


type Message = {
  text: string;
  isUser: boolean;
};

function App() {
  const [promptText, setPromptText] = useState<string>("");
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([{text: "Hello folks, How can i help you!", isUser: false}]); // Store messages
  const chatContainer = useRef<HTMLDivElement>(null);
  const chatInput = useRef<HTMLInputElement>(null);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => console.log("Code copied to clipboard!"),
      (err) => console.error("Failed to copy text: ", err)
    );
  };

  const handleSubmit = async () => {
    try {
      if (promptText.trim() !== "") {
        const prompt: string = promptText;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: prompt, isUser: true },
        ]); // Add user's prompt to messages
        setPromptText("");

        const responseText = await searchForPrompt(prompt);

        if (responseText) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: responseText, isUser: false },
          ]); // Add response to messages

          setIsInputDisabled(false);
          setIsSubmitBtnDisabled(true);

          chatInput.current?.focus();
          playRingtone();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight || 0;
    }

    if (chatInput.current && !isInputDisabled) {
      chatInput.current?.focus();
    }
  }, [isInputDisabled, messages]); // Scroll when messages change

  return (
    <>
      <div
        className="w-full h-svh border-solid border-0 border-blue-700 flex flex-col justify-between overflow-y-auto"
        ref={chatContainer}
      >
        <div className="mb-10">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-11/12 lg:w-1/2 md:w-2/3 my-6 mx-5 py-4 px-3 ${
                message.isUser
                  ? "bg-gray-100 border-2 rounded-s-xl rounded-br-3xl ms-auto"
                  : "bg-gray-100 border-2 rounded-e-xl rounded-bl-3xl"
              }`}
            >
              {/* If it's code from the bot, render markdown */}
              {!message.isUser ? (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: CodeProps) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div style={{ position: "relative" }}>
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match ? match[1] : ""}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                          <button
                            onClick={() => copyToClipboard(String(children))}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "10px",
                              background: "#007bff",
                              color: "#fff",
                              border: "none",
                              padding: "2px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Copy
                          </button>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              ) : (
                message.text // Render user message as plain text
              )}
            </div>
          ))}
        </div>

        <div className="w-full bg-white h-14 flex justify-center sticky bottom-0">
          <div className="w-11/12 sm:w-2/3 lg:w-1/2 mb-3 bg-white border-2 border-solid shadow-slate-200 shadow-lg border-blue-200 rounded-full overflow-hidden focus-within:border-blue-700 flex">
            <InputBox
              promptText={promptText}
              setPromptText={setPromptText}
              handleSubmit={handleSubmit}
              isSubmitBtnDisabled={isSubmitBtnDisabled}
              setIsSubmitBtnDisabled={setIsSubmitBtnDisabled}
              setIsInputDisabled={setIsInputDisabled}
              isInputDisabled={isInputDisabled}
              chatInput={chatInput}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
