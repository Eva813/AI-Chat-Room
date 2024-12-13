// src/app/components/snippets/SnippetsContext.jsx
'use client';
import { createContext, useContext, useState } from 'react';


const SnippetsContext = createContext();

export function SnippetsProvider({ children }) {
  const [folders, setFolders] = useState([
    {
      id: 'HplOMyf2mDqvVMdphJbt',
      name: 'My Sample Snippets',
      snippets: [
        { id: '5mJw031VPo2WxNIQyeXN', name: 'Demo - Plain text', content: 'be a software egineer' , shortcut: '/do' },
        { id: '6mJw031VPo2WxNIQyeYN', name: 'Demo - Styled Text', content: 'be a translate expert, I will give you a sentence and help me translate to english', shortcut: '/doT' },
      ],
    },
  ]);

  return (
    <SnippetsContext.Provider value={{ folders, setFolders }}>
      {children}
    </SnippetsContext.Provider>
  );
}

export const useSnippets = () => {
    return useContext(SnippetsContext);
  };
