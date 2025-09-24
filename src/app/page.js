"use client";

import { useState } from "react";
import ReactJson from "react-json-view";

export default function Home() {
  const [conversationData, setConversationData] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const sendChatRequest = async () => {
    setLoading(true);
    const url = "http://127.0.0.1:8000/agent/chat";
    const body = {
      prompt: query,
    };
    try {
      setQuery("");
      setConversationData((prev) => [
        ...prev,
        { who: "user", content: query.trim() },
      ]);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${res.statusText}\n${text}`);
      }
      const data = await res.json();
      console.log("alooooooooooooooooooooo", data);
      setQuery("");
      setConversationData((prev) => [
        ...prev,
        {
          who: "agent",
          content: data.output,
        },
      ]);
    } catch (err) {
      console.error("Request failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border-r flex flex-col">
        <div className="p-4 border-b font-bold text-lg flex justify-between">
          <p>Chat</p>
          <button onClick={() => setConversationData([])}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">Các cuộc hội thoại tại đây</div>
      </aside>

      {/* Chat Window */}
      <main className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 flex flex-col">
          {conversationData.map((item) => {
            if (item.who !== "user") {
              return (
                <div
                  key={Math.random().toString()}
                  className="self-start bg-amber-50 p-2 rounded-lg w-2/3"
                >
                  <ReactJson src={item.content} theme="monokai" collapsed={2} />
                </div>
              );
            }
            return (
              <div
                key={Math.random().toString()}
                className="self-end bg-green-300 p-2 rounded-lg w-2/3"
              >
                {item.content}
              </div>
            );
          })}
          {loading && <div>Đợi phản hồi...</div>}
        </div>

        {/* Input */}
        <footer className="p-4 border-t bg-white flex gap-2">
          <input
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-lg px-3 py-2 focus:outline-none "
          />
          <button
            onClick={sendChatRequest}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </footer>
      </main>
    </div>
  );
}
