import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProfeChat API Demo',
  description: 'API test page for ProfeChat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: 'white' }}>
        {children}
      </body>
    </html>
  );
} 