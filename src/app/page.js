"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import dayjs from 'dayjs';

export default function ChatPage() {
  const [sessions, setSessions] = useState([
    { id: 1, name: "Chat 1", messages: [], timestamp: Date.now() },
    { id: 2, name: "Chat 2", messages: [], timestamp: Date.now() },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(1);
  const [timestamps, setTimestamps] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // 更新所有會話的時間戳，並確保時間格式統一
  useEffect(() => {
    const updatedTimestamps = {};
    sessions.forEach(session => {
      updatedTimestamps[session.id] = dayjs(session.timestamp).format('YYYY-MM-DD HH:mm:ss');
    });
    setTimestamps(updatedTimestamps);
  }, [sessions]);

  // 生成新的會話ID (基於當前會話數量)
  const generateNewSessionId = () => sessions.length + 1;

  // 新建一個對話
  const createNewChat = () => {
    const newSessionId = generateNewSessionId();
    const newSession = {
      id: newSessionId,
      name: `Chat ${newSessionId}`,
      messages: [],
      timestamp: Date.now(),
    };
    setSessions((prevSessions) => [...prevSessions, newSession]); // 添加新會話
    setCurrentSessionId(newSessionId); // 切換到新會話
  };

  // 獲取當前會話
  const currentSession = sessions.find(
    (session) => session.id === currentSessionId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: Date.now(), // 添加消息時間戳
    };

    // 清空輸入框
    setInputMessage("");  // 這行應該會觸發 textarea 的清空
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 重置 textarea 高度
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
      const assistantMessage = {
        ...data.choices[0].message,
        timestamp: Date.now(), // 添加助手消息時間戳
      };

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
        timestamp: Date.now(), // 添加錯誤消息的時間戳
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
    if (e.isComposing || e.keyCode === 229) {
      // Don't submit if the user is still composing (using IME)
      return;
    }
  
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 左側 Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">會話列表</h2>
        <button
          onClick={createNewChat}
          className="w-full bg-blue-500 text-white p-2 rounded-lg mb-4 hover:bg-blue-600"
        >
          New Chat
        </button>
        <ul>
          {sessions.map((session) => (
            <li
              key={session.id}
              className={`p-2 mb-2 cursor-pointer rounded-lg ${
                session.id === currentSessionId
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setCurrentSessionId(session.id)}
            >
              <div>{session.name}</div>
              <div className="text-sm text-gray-500">
                Created: {timestamps[session.id] || "Loading..."}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 右側聊天窗口 */}
      <div className="w-3/4 bg-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Chat {currentSessionId}
        </h1>

        <div className="flex-grow overflow-y-auto max-h-96 mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
          {currentSession.messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div>
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
              {/* 顯示消息時間戳 */}
              <div className="text-sm text-gray-500">
                {dayjs(message.timestamp).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500 mt-4">
              AI 正在思考中...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <textarea
            ref={textareaRef}
            value={inputMessage} // 確保 textarea 綁定了 inputMessage
            onChange={(e) => {
              setInputMessage(e.target.value);  // 確保這裡更新 inputMessage
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
