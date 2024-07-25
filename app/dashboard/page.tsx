'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path if necessary
import Layout from '../components/Layout'; // Adjust the path if necessary
import styles from './dashboard.module.scss'; // Adjust the path if necessary

const Dashboard = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [soloName, setSoloName] = useState('');
  const [soloLevel, setSoloLevel] = useState<number>(0);
  const [mixName, setMixName] = useState('');
  const [mixLevel, setMixLevel] = useState<number>(0);
  const [trackName, setTrackName] = useState('');
  const [currentTrack, setCurrentTrack] = useState('');
  const [trackLevelName, setTrackLevelName] = useState('');
  const [bpm, setBpm] = useState(0);
  const [instruments, setInstruments] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const partData = {
      name,
      lessonName,
      soloName,
      soloLevel,
      mixName,
      mixLevel,
      trackName,
      currentTrack,
      trackLevelName,
      bpm,
      instruments,
    };

    const response = await fetch('/api/parts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partData),
    });

    if (response.ok) {
      const result = await response.json();
      setMessage(`Part and related entities created successfully.`);
      setName('');
      setLessonName('');
      setSoloName('');
      setSoloLevel(0);
      setMixName('');
      setMixLevel(0);
      setTrackName('');
      setCurrentTrack('');
      setTrackLevelName('');
      setBpm(0);
      setInstruments('');
    } else {
      setMessage('Failed to create part and related entities');
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Admin Dashboard</h1>
        {user ? (
          <div>
            <h2>Welcome, {user.name} {user.surname}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <div className={styles.formContainer}>
              <h2>Create New Part</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Part Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lessonName">Lesson Name:</label>
                  <input
                    type="text"
                    id="lessonName"
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="soloName">Solo Name:</label>
                  <input
                    type="text"
                    id="soloName"
                    value={soloName}
                    onChange={(e) => setSoloName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="soloLevel">Solo Level:</label>
                  <input
                    type="number"
                    id="soloLevel"
                    value={soloLevel}
                    onChange={(e) => setSoloLevel(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="mixName">Mix Name:</label>
                  <input
                    type="text"
                    id="mixName"
                    value={mixName}
                    onChange={(e) => setMixName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="mixLevel">Mix Level:</label>
                  <input
                    type="number"
                    id="mixLevel"
                    value={mixLevel}
                    onChange={(e) => setMixLevel(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="trackName">Track Name:</label>
                  <input
                    type="text"
                    id="trackName"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="currentTrack">Current Track URL:</label>
                  <input
                    type="text"
                    id="currentTrack"
                    value={currentTrack}
                    onChange={(e) => setCurrentTrack(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="trackLevelName">Track Level Name:</label>
                  <input
                    type="text"
                    id="trackLevelName"
                    value={trackLevelName}
                    onChange={(e) => setTrackLevelName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="bpm">BPM:</label>
                  <input
                    type="number"
                    id="bpm"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="instruments">Instruments (JSON):</label>
                  <input
                    type="text"
                    id="instruments"
                    value={instruments}
                    onChange={(e) => setInstruments(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={styles.submitButton}>Create Part and Related Entities</button>
              </form>
              {message && <p>{message}</p>}
            </div>
          </div>
        ) : (
          <p>Please log in to view your details.</p>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
