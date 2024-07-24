"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path if necessary
import Layout from '../components/Layout'; // Adjust the path if necessary
import styles from './drumplayer.module.scss'; // Assuming you have SCSS for styling

const DrumPlayer = () => {
  const { user } = useAuth();
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
            {user.role === 'teacher' && (
              <div className={styles.addStudentBox}>
                <h3>Add New Student</h3>
                <form className={styles.form} onSubmit={handleAddStudent}>
                  <input
                    type="text"
                    placeholder="Student First Name"
                    value={studentFirstName}
                    onChange={(e) => setStudentFirstName(e.target.value)}
                    required
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Student Last Name"
                    value={studentLastName}
                    onChange={(e) => setStudentLastName(e.target.value)}
                    required
                    className={styles.input}
                  />
                  <input
                    type="email"
                    placeholder="Student Email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                    className={styles.input}
                  />
                  <input
                    type="password"
                    placeholder="Student Password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Track ID"
                    value={studentTrackId}
                    onChange={(e) => setStudentTrackId(e.target.value)}
                    required
                    className={styles.input}
                  />
                  <button type="submit" className={styles.button}>Add Student</button>
                </form>
                {studentError && <p className={styles.error}>{studentError}</p>}
                {studentSuccess && <p className={styles.success}>{studentSuccess}</p>}
              </div>
            )}
          </div>
        ) : (
          <p>Please log in to view your details.</p>
        )}
      </div>
    </Layout>
  );
};

export default DrumPlayer;
