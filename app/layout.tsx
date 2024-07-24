// app/layout.js
import './globals.scss';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';

export const metadata = {
  title: 'My Next App',
  description: 'A Next.js project with Tailwind CSS and SCSS',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
