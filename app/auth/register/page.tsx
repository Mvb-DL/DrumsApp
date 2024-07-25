"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './register.module.scss';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext'; 

export default function Register() {
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async (e) => {

    e.preventDefault();
    setError(''); 
    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role
    };

    if (role === 'customer') {
      data.phoneNumber = formData.get('phoneNumber') as string;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        login({
          id: result.id,
          surname: data.lastName,
          name: data.firstName,
          email: data.email,
          role: data.role
        });

       if (result.role === 'teacher') {
         router.push('/drumplayer-teacher');
       } else {
         router.push('/drumplayer');
       }

      } else {
        const result = await response.json();
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed', error);
      setError('Registration failed');
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Register Page</h1>
        <div className={styles.roleSelection}>
          <button
            className={`${styles.roleButton} ${role === 'customer' ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
          <button
            className={`${styles.roleButton} ${role === 'teacher' ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => setRole('teacher')}
          >
            Teacher
          </button>
        </div>
        <form className={styles.form} onSubmit={handleRegister}>
          <input name="firstName" type="text" placeholder="First Name" className={styles.input} required />
          <input name="lastName" type="text" placeholder="Last Name" className={styles.input} required />
          <input name="email" type="email" placeholder="Email" className={styles.input} required />
          <input name="password" type="password" placeholder="Password" className={styles.input} required />
          
          {role === 'customer' && (
            <input name="phoneNumber" type="text" placeholder="Phone Number" className={styles.input} required />
          )}

          <button type="submit" className={styles.button}>Register</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.backLink}>
          <Link href="/">Back to Home</Link>
        </div>
        <div className={styles.backLink}>
          <Link href="/auth/login">Login</Link>
        </div>
      </div>
    </Layout>
  );
}
