"use client";
// pages/snippets/folder/[id].tsx
import Link from 'next/link';


const FolderPage = ({ params }) => {
  const { folderId } = params;

  const folders = [
    {
      id: 'HplOMyf2mDqvVMdphJbt',
      name: 'My Sample Snippets',
      snippets: [
        { id: '5mJw031VPo2WxNIQyeXN', name: 'Demo - Plain text' },
        { id: '6mJw031VPo2WxNIQyeYN', name: 'Demo - Styled Text' },
      ],
    },
  ];

  const currentFolder = folders.find(folder => folder.id === folderId);

  if (!currentFolder) {
    return <p>Folder not found.</p>;
  }

  return (
    <div>
      <h1>{currentFolder.name}</h1>
      {/* <ul>
        {currentFolder.snippets.map(snippet => (
          <li key={snippet.id}>
            <Link href={`/snippets/snippet/${snippet.id}`}>
              {snippet.name}
            </Link>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default FolderPage;