import Sidebar from '../../app/components/snippets/sidebar';
import { SnippetsProvider } from './SnippetsContext';

export default function SnippetsLayout({ children }) {
  return (
    <SnippetsProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SnippetsProvider>
  )
}