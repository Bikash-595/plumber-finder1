"use client";

import { useState } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";

export default function ContactChatPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "👋 Hi! How can we help you today?", isUser: false },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { text: message, isUser: true }]);
    setMessage("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Thanks for reaching out! A support agent will be with you shortly.", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <span>💬</span> Live Chat Support
          </h2>
          <p className="text-sm text-gray-500">Chat with our team – average response 2 min</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-[#FFD60A] p-2 text-white transition hover:brightness-105"
        >
          <FaCommentDots className="h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">PlumberFinder Support</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
          <div className="h-48 overflow-y-auto space-y-2 mb-3 p-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    msg.isUser ? "bg-[#FFD60A] text-white" : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-[#FFD60A]"
            />
            <button
              onClick={sendMessage}
              className="rounded-full bg-[#FFD60A] px-3 py-2 text-white transition hover:brightness-105"
            >
              <FaPaperPlane className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}