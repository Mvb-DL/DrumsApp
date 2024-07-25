'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import styles from './dashboard.module.scss';

const Dashboard = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [currentPartId, setCurrentPartId] = useState<number | null>(null);
  const [previousPartId, setPreviousPartId] = useState<number | null>(null);
  const [nextPartId, setNextPartId] = useState<number | null>(null);
  const [lessonName, setLessonName] = useState('');
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const [previousLessonId, setPreviousLessonId] = useState<number | null>(null);
  const [nextLessonId, setNextLessonId] = useState<number | null>(null);
  const [soloName, setSoloName] = useState('');
  const [currentSoloId, setCurrentSoloId] = useState<number | null>(null);
  const [previousSoloId, setPreviousSoloId] = useState<number | null>(null);
  const [nextSoloId, setNextSoloId] = useState<number | null>(null);
  const [soloLevel, setSoloLevel] = useState<number>(0);
  const [mixName, setMixName] = useState('');
  const [currentMixId, setCurrentMixId] = useState<number | null>(null);
  const [previousMixId, setPreviousMixId] = useState<number | null>(null);
  const [nextMixId, setNextMixId] = useState<number | null>(null);
  const [mixLevel, setMixLevel] = useState<number>(0);
  const [trackName, setTrackName] = useState('');
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);
  const [previousTrackId, setPreviousTrackId] = useState<number | null>(null);
  const [nextTrackId, setNextTrackId] = useState<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState('');
  const [trackLevelName, setTrackLevelName] = useState('');
  const [bpm, setBpm] = useState<number>(0);
  const [instruments, setInstruments] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null); // Add this line

  useEffect(() => {
    setPreviousPartId(currentPartId ? currentPartId - 1 : null);
    setNextPartId(currentPartId ? currentPartId + 1 : null);
  }, [currentPartId]);

  useEffect(() => {
    setPreviousLessonId(currentLessonId ? currentLessonId - 1 : null);
    setNextLessonId(currentLessonId ? currentLessonId + 1 : null);
  }, [currentLessonId]);

  useEffect(() => {
    setPreviousSoloId(currentSoloId ? currentSoloId - 1 : null);
    setNextSoloId(currentSoloId ? currentSoloId + 1 : null);
  }, [currentSoloId]);

  useEffect(() => {
    setPreviousMixId(currentMixId ? currentMixId - 1 : null);
    setNextMixId(currentMixId ? currentMixId + 1 : null);
  }, [currentMixId]);

  useEffect(() => {
    setPreviousTrackId(currentTrackId ? currentTrackId - 1 : null);
    setNextTrackId(currentTrackId ? currentTrackId + 1 : null);
  }, [currentTrackId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('previousPartId', previousPartId?.toString() || '');
    formData.append('currentPartId', currentPartId?.toString() || '');
    formData.append('nextPartId', nextPartId?.toString() || '');
    formData.append('lessonName', lessonName);
    formData.append('previousLessonId', previousLessonId?.toString() || '');
    formData.append('currentLessonId', currentLessonId?.toString() || '');
    formData.append('nextLessonId', nextLessonId?.toString() || '');
    formData.append('soloName', soloName);
    formData.append('previousSoloId', previousSoloId?.toString() || '');
    formData.append('currentSoloId', currentSoloId?.toString() || '');
    formData.append('nextSoloId', nextSoloId?.toString() || '');
    formData.append('soloLevel', soloLevel.toString());
    formData.append('mixName', mixName);
    formData.append('previousMixId', previousMixId?.toString() || '');
    formData.append('currentMixId', currentMixId?.toString() || '');
    formData.append('nextMixId', nextMixId?.toString() || '');
    formData.append('mixLevel', mixLevel.toString());
    formData.append('trackName', trackName);
    formData.append('previousTrackId', previousTrackId?.toString() || '');
    formData.append('currentTrackId', currentTrackId?.toString() || '');
    formData.append('nextTrackId', nextTrackId?.toString() || '');
    formData.append('currentTrack', currentTrack);
    formData.append('trackLevelName', trackLevelName);
    formData.append('bpm', bpm.toString());
    formData.append('instruments', instruments);
    if (image) {
      formData.append('image', image);
    }

    const response = await fetch('/api/parts', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      setMessage(`Part and related entities created successfully.`);
      setName('');
      setCurrentPartId(null);
      setLessonName('');
      setCurrentLessonId(null);
      setSoloName('');
      setCurrentSoloId(null);
      setSoloLevel(0);
      setMixName('');
      setCurrentMixId(null);
      setMixLevel(0);
      setTrackName('');
      setCurrentTrackId(null);
      setCurrentTrack('');
      setTrackLevelName('');
      setBpm(0);
      setInstruments('');
      setImage(null); // Add this line
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
                  <label htmlFor="currentPartId">Current Part ID:</label>
                  <input
                    type="number"
                    id="currentPartId"
                    value={currentPartId ?? ''}
                    min="1"
                    max="6"
                    onChange={(e) => setCurrentPartId(e.target.value ? parseInt(e.target.value) : null)}
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
                  <label htmlFor="currentLessonId">Current Lesson ID:</label>
                  <input
                    type="number"
                    id="currentLessonId"
                    value={currentLessonId ?? ''}
                    min="1"
                    max="6"
                    onChange={(e) => setCurrentLessonId(e.target.value ? parseInt(e.target.value) : null)}
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
                  <label htmlFor="currentSoloId">Current Solo ID:</label>
                  <input
                    type="number"
                    id="currentSoloId"
                    value={currentSoloId ?? ''}
                    min="1"
                    max="6"
                    onChange={(e) => setCurrentSoloId(e.target.value ? parseInt(e.target.value) : null)}
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
                  <label htmlFor="currentMixId">Current Mix ID:</label>
                  <input
                    type="number"
                    id="currentMixId"
                    value={currentMixId ?? ''}
                    min="1"
                    max="6"
                    onChange={(e) => setCurrentMixId(e.target.value ? parseInt(e.target.value) : null)}
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
                  <label htmlFor="currentTrackId">Current Track ID:</label>
                  <input
                    type="number"
                    id="currentTrackId"
                    value={currentTrackId ?? ''}
                    min="1"
                    max="6"
                    onChange={(e) => setCurrentTrackId(e.target.value ? parseInt(e.target.value) : null)}
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
                    min="0"
                    max="240"
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
                <div className={styles.formGroup}>
                  <label htmlFor="image">Image:</label>
                  <input
                    type="file"
                    id="image"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
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
