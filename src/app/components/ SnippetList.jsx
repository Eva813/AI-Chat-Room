// components/SnippetList.jsx
import Link from 'next/link';
import { useState } from 'react';

const SnippetList = () => {
  const [folders, setFolders] = useState([
    {
      id: 'HplOMyf2mDqvVMdphJbt',
      name: 'My Sample Snippets',
      snippets: [
        { id: '5mJw031VPo2WxNIQyeXN', name: 'Demo - Plain text', shortcut: '/sig' },
        { id: '6mJw031VPo2WxNIQyeYN', name: 'Demo - Styled Text', shortcut: '/style' }
      ]
    }
  ]);

  const addFolder = () => {
    const newFolder = { id: Date.now().toString(), name: 'New Folder', snippets: [] };
    setFolders([...folders, newFolder]);
  };

  return (
    <div>
      <button onClick={addFolder}>+ New Folder</button>
      {folders.map(folder => (
        <div key={folder.id}>
          <Link href={`/snippets/folder/${folder.id}`}>{folder.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default SnippetList;
