'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import styles from './dashboard.module.scss';

interface Part {
  id: number;
  name: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const [newPartName, setNewPartName] = useState('');
  const [name, setName] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [soloName, setSoloName] = useState('');
  const [soloLevel, setSoloLevel] = useState<number>(0);
  const [mixName, setMixName] = useState('');
  const [mixLevel, setMixLevel] = useState<number>(0);
  const [trackName, setTrackName] = useState('');
  const [currentTrack, setCurrentTrack] = useState('');
  const [trackLevelName, setTrackLevelName] = useState('');
  const [bpm, setBpm] = useState<number>(0);
  const [instruments, setInstruments] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      const response = await fetch('/api/parts');
      const partsData: Part[] = await response.json();
      setParts(partsData);
    };

    fetchParts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('selectedPartId', selectedPartId?.toString() || '');
    formData.append('name', name);
    formData.append('lessonName', lessonName);
    formData.append('soloName', soloName);
    formData.append('soloLevel', soloLevel.toString());
    formData.append('mixName', mixName);
    formData.append('mixLevel', mixLevel.toString());
    formData.append('trackName', trackName);
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
      setImage(null);
      setSelectedPartId(null);
      setNewPartName('');
    } else {
      setMessage('Failed to create part and related entities');
    }
  };

  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newPartName);
    if (image) {
      formData.append('image', image);
    }

    const response = await fetch('/api/parts', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const newPart = await response.json();
      setParts((prevParts) => [...prevParts, newPart]);
      setSelectedPartId(newPart.id); // Automatically set the new part ID
      setNewPartName('');
      setImage(null); // Clear the image
      setMessage('Part created successfully');
    } else {
      setMessage('Failed to create part');
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
              {parts.length < 6 ? (
                <form onSubmit={handleCreatePart}>
                  <div className={styles.formGroup}>
                    <label htmlFor="newPartName">New Part Name:</label>
                    <input
                      type="text"
                      id="newPartName"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
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
                  <button type="submit" className={styles.submitButton}>Create Part</button>
                </form>
              ) : (
                <p>Maximum number of parts created</p>
              )}
              <h2>Add Information to Part</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="selectedPartId">Select Part:</label>
                  <select
                    id="selectedPartId"
                    value={selectedPartId ?? ''}
                    onChange={(e) => setSelectedPartId(e.target.value ? parseInt(e.target.value) : null)}
                    required
                  >
                    <option value="" disabled>Select a Part</option>
                    {parts.map((part) => (
                      <option key={part.id} value={part.id}>{part.name}</option>
                    ))}
                  </select>
                </div>
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
