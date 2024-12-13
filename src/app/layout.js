import './globals.css';
import { SnippetsProvider } from './snippets/SnippetsContext';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 font-sans">
      <SnippetsProvider>
        {children}
        </SnippetsProvider>
      </body>
    </html>
  );
}