"use client";

import { useState, useEffect } from "react";
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

  const initialLoadHandler = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/onLoad");
      const data = await res.json();
      const humanData = await JSON.parse(data.message);
      setMessages([{ role: "assistant", text: humanData.completion }]);
    } catch {
      setMessages([
        {
          role: "Assiastant",
          text: "An error occured loading, please reload this page",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLoadHandler();
  }, []);

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
      const humanData = await JSON.parse(data.body);
      const aiMsg = { role: "bot", text: humanData.completion };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.log(err);
      alert("An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h3 className={quicksand.className} style={{ marginBottom: "0.5rem" }}>
        Chat Assistant
      </h3>
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
              <strong>{msg.role === "user" ? "You" : "Agropaddy"}:</strong>{" "}
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
