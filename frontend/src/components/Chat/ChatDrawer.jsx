import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchChatHistory, sendChatMessage } from "../../api/athlete";
import "./chat.css";

const MotionDiv = motion.div;

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="chat-avatar-icon">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="chat-avatar-icon">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A1.5 1.5 0 0 0 6 14.5 1.5 1.5 0 0 0 7.5 16 1.5 1.5 0 0 0 9 14.5 1.5 1.5 0 0 0 7.5 13m9 0A1.5 1.5 0 0 0 15 14.5 1.5 1.5 0 0 0 16.5 16 1.5 1.5 0 0 0 18 14.5 1.5 1.5 0 0 0 16.5 13M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1H5z" />
  </svg>
);

const ChatDrawer = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && !historyLoaded) {
      fetchChatHistory().then((history) => {
        setMessages(history);
        setHistoryLoaded(true);
      });
    }
  }, [open, historyLoaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { reply } = await sendChatMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <MotionDiv
            className="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <MotionDiv
            className="chat-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="chat-header">
              <div className="chat-header-title">
                <BotIcon />
                <span>Coach</span>
              </div>
              <button className="chat-close" onClick={onClose} aria-label="Close">✕</button>
            </div>

            <div className="chat-messages">
              {messages.length === 0 && !loading && (
                <div className="chat-empty">
                  <p>Ask me anything about your training — pacing, mileage, injury prevention, recovery, and more.</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`chat-message ${m.role}`}>
                  <div className="chat-avatar">
                    {m.role === "assistant" ? <BotIcon /> : <UserIcon />}
                  </div>
                  <div className="chat-bubble">{m.content}</div>
                </div>
              ))}
              {loading && (
                <div className="chat-message assistant">
                  <div className="chat-avatar"><BotIcon /></div>
                  <div className="chat-bubble chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input-row">
              <textarea
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your coach..."
                rows={1}
              />
              <button
                className="chat-send"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatDrawer;