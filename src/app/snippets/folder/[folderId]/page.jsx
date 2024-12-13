"use client";
// pages/snippets/folder/[id].tsx
import Link from 'next/link';
import { useSnippets } from '../../SnippetsContext';

const FolderPage = ({ params }) => {
  const { folderId } = params;
  const { folders } = useSnippets();

  const currentFolder = folders.find(folder => folder.id === folderId);

  if (!currentFolder) {
    return <p>Folder not found.</p>;
  }

  return (
    <div>
      <h1>{currentFolder.name}</h1>
      {/* 可以在這裡加入編輯區塊的邏輯，例如預設畫面 */}
      {/* <textarea defaultValue="Default folder edit content" /> */}
    </div>
  );
};

export default FolderPage;