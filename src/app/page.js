"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "prismjs/themes/prism.css";  // Import Prism.js CSS
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia as theme } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import dayjs from 'dayjs';
import remarkGfm from 'remark-gfm';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter style={theme} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Update all timestamps
  useEffect(() => {
    const updatedTimestamps = {};
    sessions.forEach(session => {
      updatedTimestamps[session.id] = dayjs(session.timestamp).format('YYYY-MM-DD HH:mm:ss');
    });
    setTimestamps(updatedTimestamps);
  }, [sessions]);

  const generateNewSessionId = () => sessions.length + 1;

  const createNewChat = () => {
    const newSessionId = generateNewSessionId();
    const newSession = {
      id: newSessionId,
      name: `Chat ${newSessionId}`,
      messages: [],
      timestamp: Date.now(),
    };
    setSessions((prevSessions) => [...prevSessions, newSession]);
    setCurrentSessionId(newSessionId);
  };

  const currentSession = sessions.find((session) => session.id === currentSessionId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: Date.now(),
    };

    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // 更新當前對話的用戶消息
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      )
    );

    //  // 第一次發送消息後，根據內容生成對話標題
    // if (currentSession.messages.length === 0) {
    //   await generateTitleForConversation(userMessage.content);
    // }

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...currentSession.messages, userMessage],
        }),
      });

      const data = await response.json();

      const processedContent = data.choices[0].message.content.replace(/\n\s*\n/g, '\n'); // Replace excessive newlines
      const assistantMessage = {
        role: "assistant",
        content: processedContent,
        timestamp: Date.now(),
      };

      // 更新當前對話的助理消息
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
        timestamp: Date.now(),
      };

      // 更新當前對話的錯誤消息
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
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const generateTitleForConversation = async (userMessage) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Please generate a short and clear title (no more than 30 characters) for the following message." },
            { role: "user", content: userMessage }
          ],
        }),
      });

      const data = await response.json();
      let generatedTitle = data.choices[0].message.content.trim();
  
      // 確保標題不超過 30 個字符，並在過長時進行截斷
      if (generatedTitle.length > 30) {
        generatedTitle = generatedTitle.slice(0, 30) + "...";
      }
      console.log("Generated title:", generatedTitle);

      // 更新對話的標題
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === currentSessionId
            ? { ...session, name: generatedTitle }
            : session
        )
      );
    } catch (error) {
      console.error("Error generating conversation title:", error);
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Left Sidebar */}
      {isSidebarOpen && (<>
        <div className="w-1/4 bg-olive-lightest overflow-y-auto p-4">
          <h2 className="text-xl font-bold mb-4">Chat list</h2>
            <button
              onClick={createNewChat}
              className="w-full bg-olive-light text-white p-2 rounded-lg mb-4 hover:bg-olive"
            >
              New Chat
            </button>
            <ul>
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className={`p-2 mb-2 cursor-pointer rounded-lg ${
                    session.id === currentSessionId
                      ? "bg-olive-light text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <div>{session.name}</div>
                  <div className={`text-sm ${
                    session.id === currentSessionId
                      ? "text-white"
                      : "text-black"
                  }`}>
                    Created: {timestamps[session.id] || "Loading..."}
                  </div>
                </li>
              ))}
            </ul>
        </div></>)}

      {/* Chat window */}
      <div className={`${isSidebarOpen ? "w-3/4" : "w-full"} bg-white flex flex-col p-2`}>
        <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 bg-olive-light text-white p-2 rounded-lg mb-4 hover:bg-olive"
          >
            {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}

          </button>
        <h1 className="text-2xl font-bold mb-4 text-center">
            {currentSession?.name || `Chat ${currentSessionId}`}
        </h1>

        <div className="flex-grow overflow-y-auto max-h-dvh mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
          {currentSession.messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div>
                {message.role === "user" ? (
                  <p className="inline-block p-3 rounded-lg whitespace-normal leading-relaxed bg-olive-light text-white">
                    {message.content}
                  </p>
                ) : (
                  <div className="inline-block p-3 rounded-lg whitespace-normal leading-[1.8] bg-white text-[#66785F]-900 border border-gray-300">
                    <ReactMarkdown className="custom-markdown" components={components} remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
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
            className="bg-olive-light text-white px-4 py-2 rounded-lg hover:bg-olive transition"
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? "等待中..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
