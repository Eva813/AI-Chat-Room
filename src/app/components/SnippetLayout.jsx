"use client";
import { useRouter } from 'next/router';
import SnippetList from './SnippetList';
import FolderPage from '../snippet/pages/folder/[id]';
import SnippetPage from '../snippet/pages/snippet/[id]';

const SnippetLayout = () => {
  const router = useRouter();
  const { type, id } = router.query;  // 解析 URL 中的 type 和 id

  return (
    <div style={{ display: 'flex' }}>
      {/* 左側列表 */}
      <div style={{ width: '300px', padding: '10px', backgroundColor: '#f9f9f9' }}>
        <SnippetList />
      </div>

      {/* 右側內容區域：顯示資料夾內的 Snippet 或 Snippet 編輯頁面 */}
      <div style={{ padding: '10px', flexGrow: 1 }}>
        {type === 'folder' && <FolderPage id={id} />}
        {type === 'snippet' && <SnippetPage id={id} />}
      </div>
    </div>
  );
};

export default SnippetLayout;
