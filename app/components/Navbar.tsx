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
      <ul className={styles.navList}>
        {pathname !== '/' && (
          <li className={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
        )}
        {pathname !== '/auth/login' && (
          <li className={styles.navItem}>
            <Link href="/auth/login">Login</Link>
          </li>
        )}
        {pathname !== '/auth/register' && (
          <li className={styles.navItem}>
            <Link href="/auth/register">Register</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
