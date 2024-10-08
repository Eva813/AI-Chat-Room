"use client";

import { useState } from 'react';

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

      // 添加助理回應到對話列表
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Gemini Chat App</h1>

        <div className="overflow-y-auto max-h-96 mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
          {chatMessages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <p className={`inline-block p-3 rounded-lg whitespace-pre-wrap ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 border border-gray-300'}`}>
                {message.content}
              </p>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500 mt-4">
              AI 正在思考中...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter your message"
            required
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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