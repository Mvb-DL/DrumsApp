// app/auth/login/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.scss';
import Layout from '../../components/Layout';

export default function Login() {
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Fehler zurücksetzen
    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setRole(result.role);
        router.push('/drumplayer');
      } else {
        const result = await response.json();
        setError(result.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed');
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Login Page</h1>
        <form className={styles.form} onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" className={styles.input} required />
          <input name="password" type="password" placeholder="Password" className={styles.input} required />
          <button type="submit" className={styles.button}>Login</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {role && <p>You are logged in as a {role}</p>}
        <div className={styles.backLink}>
          <Link href="/">Back to Home</Link>
        </div>
        <div className={styles.backLink}>
          <Link href="/drumplayer">Go to Drum Player</Link>
        </div>
      </div>
    </Layout>
  );
}
