"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  // 多個會話的狀態管理
  const [sessions, setSessions] = useState([
    { id: 1, name: "Chat 1", messages: [] },
    { id: 2, name: "Chat 2", messages: [] },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(1);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // 獲取當前會話
  const currentSession = sessions.find(
    (session) => session.id === currentSessionId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage) return;

    const userMessage = { role: "user", content: inputMessage };

    // 清空輸入框和重置 textarea 高度
    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // 更新當前會話中的訊息
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      )
    );

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: inputMessage }],
        }),
      });

      const data = await response.json();
      const assistantMessage = data.choices[0].message;

      // 更新會話中的助手回應
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, assistantMessage] }
            : session
        )
      );
    } catch (error) {
      console.error("Error fetching chat response:", error);
      const errorMessage = {
        role: "assistant",
        content: "Failed to get a response. Please try again later.",
      };

      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, errorMessage] }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // 切換會話
  const switchSession = (id) => {
    setCurrentSessionId(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 左側 Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">會話列表</h2>
        <ul>
          {sessions.map((session) => (
            <li
              key={session.id}
              className={`p-2 mb-2 cursor-pointer rounded-lg ${
                session.id === currentSessionId
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => switchSession(session.id)}
            >
              {session.name}
            </li>
          ))}
        </ul>
      </div>

      {/* 右側聊天窗口 */}
      <div className="w-3/4 bg-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center">Chat {currentSessionId}</h1>

        <div className="flex-grow overflow-y-auto max-h-96 mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
          {currentSession.messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {message.role === "user" ? (
                <p className="inline-block p-3 rounded-lg whitespace-pre-wrap bg-blue-500 text-white">
                  {message.content}
                </p>
              ) : (
                <div className="inline-block p-3 rounded-lg whitespace-pre-wrap bg-white text-gray-900 border border-gray-300">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500 mt-4">AI 正在思考中...</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message"
            required
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
            rows={1}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            {isLoading ? "等待中..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
