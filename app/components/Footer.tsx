// app/components/Footer.tsx
"use client"; 

import React from 'react';
import Link from 'next/link';
import styles from './component_styles/Footer.module.scss'; 

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link href="/organization/impressum">Impressum</Link>
      <Link href="/organization/dsgvo">DSGVO</Link>
    </footer>
  );
};

export default Footer;
