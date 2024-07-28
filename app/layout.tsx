// app/layout.js
import './globals.scss';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import CookieBanner from "./components/CookieBanner"

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
      <CookieBanner />
        <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
