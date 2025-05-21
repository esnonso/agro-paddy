"use client";

import { useState } from "react";
import { Quicksand } from "next/font/google";
import styles from "./chat.module.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // optional, prevents form submission
      sendMessage();
    }
  };

  const sendMessage = async () => {
    try {
      if (!input) return;
      setLoading(true);
      const msgHistory = [...messages, { role: "user", content: input }];
      const userMsg = { role: "user", text: input };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: msgHistory }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      const aiMsg = { role: "bot", text: data };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      alert("An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h2 className={quicksand.className}>Chat Assistant</h2>
      <div className={styles["chat-box"]}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user"
                ? styles["message-user"]
                : styles["message-bot"]
            }
          >
            <p
              className={`inline-block px-3 py-2 rounded ${
                msg.role === "user" ? "bg-green-200" : "bg-gray-200"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "AgroSage"}:</strong>{" "}
              {msg.text}
            </p>
          </div>
        ))}

        {loading && (
          <div className={styles["typing-indicator"]}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
      <div className={styles["input-box"]}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a  question..."
          onKeyDown={handleEnterKey}
        />
        <button onClick={sendMessage} className={styles.btn} disabled={loading}>
          Send
        </button>
      </div>
    </main>
  );
}
