"use client";
import { useState } from 'react';

const SnippetPage = ({ id }) => {
  const [snippets, setSnippets] = useState([
    { id: '5mJw031VPo2WxNIQyeXN', name: 'Demo - Plain text', content: 'Insert plain text' },
    { id: '6mJw031VPo2WxNIQyeYN', name: 'Demo - Styled Text', content: 'Insert styled text' }
  ]);

  const currentSnippet = snippets.find(snippet => snippet.id === id);

  return (
    <div>
      <h1>{currentSnippet?.name}</h1>
      <textarea value={currentSnippet?.content} readOnly />
    </div>
  );
};

export default SnippetPage;
