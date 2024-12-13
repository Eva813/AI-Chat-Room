import Sidebar from '../../app/components/snippets/sidebar';

export default function SnippetsLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}