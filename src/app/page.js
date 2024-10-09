"use client";

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 清空輸入框
    setInputMessage('');

    // 添加用戶訊息到對話列表
    const userMessage = {
      role: 'user',
      content: inputMessage,
    };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    // 顯示加載狀態
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: inputMessage }],
        }),
      });

      const data = await response.json();
      const assistantMessage = data.choices[0].message;

      // 加入回應對話列表
      setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Failed to get a response. Please try again later.',
      };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      // 隱藏加載狀態
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 防止默認的換行行為
      handleSubmit(e); // 當按下 Enter 並且沒有按 Shift 時提交表單
    }
  };

  const handleInput = () => {
    // 自動調整 textarea 的高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Chat App</h1>

        <div className="overflow-y-auto max-h-96 mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
          {chatMessages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              {message.role === 'user' ? (
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
              handleInput(); // 每次輸入時自動調整高度
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
            {isLoading ? '等待中...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}