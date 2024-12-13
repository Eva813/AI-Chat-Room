// src/app/components/snippets/Sidebar.jsx
import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const folders = [
    {
      id: 'HplOMyf2mDqvVMdphJbt',
      name: 'My Sample Snippets',
      snippets: [
        { id: '5mJw031VPo2WxNIQyeXN', name: 'Demo - Plain text' },
        { id: '6mJw031VPo2WxNIQyeYN', name: 'Demo - Styled Text' },
      ],
    },
    // Add more folders as needed
  ];

  return (
    <div className="w-1/4 p-4 bg-gray-100">
      <h2 className="text-lg font-semibold mb-4">Folders</h2>
      <ul>
        {folders.map((folder) => (
          <li key={folder.id} className="mb-2">
            <Link href={`/snippets/folder/${folder.id}`}>
              <strong className="cursor-pointer">{folder.name}</strong>
            </Link>
            <ul className="ml-4 mt-1">
              {folder.snippets.map((snippet) => (
                <li key={snippet.id} className="mt-1">
                  <Link href={`/snippets/snippet/${snippet.id}`}>
                    {snippet.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;