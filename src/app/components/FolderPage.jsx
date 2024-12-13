// components/FolderPage.jsx
import { useState } from 'react';

// const FolderPage = ({ id }) => {
//   const [folders, setFolders] = useState([
//     {
//       id: 'HplOMyf2mDqvVMdphJbt',
//       name: 'My Sample Snippets',
//       snippets: [
//         { id: '5mJw031VPo2WxNIQyeXN', name: 'Demo - Plain text', shortcut: '/sig' },
//         { id: '6mJw031VPo2WxNIQyeYN', name: 'Demo - Styled Text', shortcut: '/style' }
//       ]
//     }
//   ]);

//   const currentFolder = folders.find(folder => folder.id === id);

//   return (
//     <div>
//       <h1>{currentFolder?.name}</h1>
//       <ul>
//         {currentFolder?.snippets.map(snippet => (
//           <li key={snippet.id}>
//             <a href={`/snippet/snippet/${snippet.id}`}>{snippet.name} ({snippet.shortcut})</a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FolderPage;

import { useRouter } from 'next/router';

const FolderPage = () => {
  const router = useRouter();
  const { id } = router.query;  // 這裡抓取 URL 中的 id 參數

  // 假設資料夾資料
  const folders = [
    {
      id: 'HplOMyf2mDqvVMdphJbt',
      name: 'My Sample Snippets',
      snippets: [
        { id: '5mJw031VPo2WxNIQyeXN', name: 'Demo - Plain text' },
        { id: '6mJw031VPo2WxNIQyeYN', name: 'Demo - Styled Text' }
      ]
    }
  ];

  const currentFolder = folders.find(folder => folder.id === id);

  return (
    <div>
      {currentFolder ? (
        <div>
          <h1>{currentFolder.name}</h1>
          <ul>
            {currentFolder.snippets.map(snippet => (
              <li key={snippet.id}>
                <a href={`/snippet/snippet/${snippet.id}`}>{snippet.name}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Folder not found</p>
      )}
    </div>
  );
};

export default FolderPage;
