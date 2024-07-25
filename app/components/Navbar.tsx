"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Adjust the path if necessary
import styles from './component_styles/Navbar.module.scss'; // Assuming you are using SCSS

const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/">Home</Link>
        </li>
        {user ? (
          <>
            <li className={styles.navItem}>
              <Link href="/account">Account</Link>
            </li>
            <li className={styles.navItem}>
              <button onClick={handleLogout} className={styles.button}>Logout</button>
            </li>
          </>
        ) : (
          <>
            {pathname === '/auth/login' && (
              <li className={styles.navItem}>
                <Link href="/auth/register">Register</Link>
              </li>
            )}
            {pathname === '/auth/register' && (
              <li className={styles.navItem}>
                <Link href="/auth/login">Login</Link>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
