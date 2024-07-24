// app/layout.js
import './globals.scss';

export const metadata = {
  title: 'My Next App',
  description: 'A Next.js project with Tailwind CSS and SCSS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
