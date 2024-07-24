// app/components/Footer.tsx
"use client"; // Mark this component as a Client Component

import React from 'react';
import Link from 'next/link';
import styles from './component_styles/Footer.module.scss'; // Assuming you are using SCSS

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link href="/impressum">Impressum</Link>
    </footer>
  );
};

export default Footer;
