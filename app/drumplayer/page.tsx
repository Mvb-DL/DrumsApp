"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Adjust the path if necessary
import Layout from '../components/Layout'; // Adjust the path if necessary
import styles from './drumplayer.module.scss'; // Assuming you have SCSS for styling

const DrumPlayer = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentTrackId, setStudentTrackId] = useState('');
  const [studentError, setStudentError] = useState('');
  const [studentSuccess, setStudentSuccess] = useState('');

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setStudentError('');
    setStudentSuccess('');

    if (!user) {
      setStudentError('User is not authenticated.');
      return;
    }

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: studentFirstName,
          lastName: studentLastName,
          email: studentEmail,
          password: studentPassword,
          trackId: studentTrackId,
          teacherId: user.id
        }),
      });

      if (response.ok) {
        setStudentSuccess('Student added successfully!');
        setStudentFirstName('');
        setStudentLastName('');
        setStudentEmail('');
        setStudentPassword('');
        setStudentTrackId('');
      } else {
        const result = await response.json();
        setStudentError(result.error || 'Failed to add student');
      }
    } catch (error) {
      console.error('Failed to add student', error);
      setStudentError('Failed to add student');
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Drum Player</h1>
        {user ? (
          <div>
            <h2>Welcome, {user.name} {user.surname}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        ) : (
          <p>Please log in to view your details.</p>
        )}
      </div>
    </Layout>
  );
};

export default DrumPlayer;
