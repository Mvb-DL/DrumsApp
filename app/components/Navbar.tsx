// app/components/Navbar.tsx
"use client"; // Mark this component as a Client Component

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './component_styles/Navbar.module.scss'; // Assuming you are using SCSS

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      {pathname !== '/' && (
        <Link href="/">Home</Link>
      )}
      {pathname !== '/auth/login' && (
        <Link href="/auth/login">Login</Link>
      )}
      {pathname !== '/auth/register' && (
        <Link href="/auth/register">Register</Link>
      )}
    </nav>
  );
};

export default Navbar;
