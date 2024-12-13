"use client";
// pages/snippets/snippet/[id].tsx
import { useState } from 'react';



const SnippetPage = ({ params }) => {
  const { snippetId } = params;

  const snippets = [
    { id: '5mJw031VPo2WxNIQyeXN', name: 'Demo - Plain text', content: 'Insert plain text' },
    { id: '6mJw031VPo2WxNIQyeYN', name: 'Demo - Styled Text', content: 'Insert styled text' },
  ];

  const currentSnippet = snippets.find(snippet => snippet.id === snippetId);

  if (!currentSnippet) {
    return <p>Snippet not found.</p>;
  }

  return (
    <div>
      <h1>{currentSnippet.name}</h1>
      <textarea value={currentSnippet.content} readOnly />
    </div>
  );
};

export default SnippetPage;

