'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; 
import Layout from '../components/Layout'; 
import styles from './drumplayer.module.scss'; 

interface Part {
  id: number;
  name: string;
  imageUrl?: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  name: string;
  solos: Solo[];
}

interface Solo {
  id: number;
  name: string;
  level: number;
  mixes: Mix[];
}

interface Mix {
  id: number;
  name: string;
  level: number;
  tracks: Track[];
}

interface Track {
  id: number;
  name: string;
  currentTrack: string;
}

const DrumPlayer = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [error, setError] = useState('');
  const [openPartId, setOpenPartId] = useState<number | null>(null);
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);
  const [openSoloId, setOpenSoloId] = useState<number | null>(null);
  const [openMixId, setOpenMixId] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await fetch('/api/parts');
        if (!response.ok) {
          throw new Error('Failed to fetch parts');
        }
        const data: Part[] = await response.json();
        setParts(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchParts();
  }, []);

  const togglePart = (partId: number) => {
    setOpenPartId(openPartId === partId ? null : partId);
    setOpenLessonId(null);
    setOpenSoloId(null);
    setOpenMixId(null);
  };

  const toggleLesson = (lessonId: number) => {
    setOpenLessonId(openLessonId === lessonId ? null : lessonId);
    setOpenSoloId(null);
    setOpenMixId(null);
  };

  const toggleSolo = (soloId: number) => {
    setOpenSoloId(openSoloId === soloId ? null : soloId);
    setOpenMixId(null);
  };

  const toggleMix = (mixId: number) => {
    setOpenMixId(openMixId === mixId ? null : mixId);
  };

  const collapseAll = () => {
    setOpenPartId(null);
    setOpenLessonId(null);
    setOpenSoloId(null);
    setOpenMixId(null);
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
            {error && <p className={styles.error}>{error}</p>}
            <button onClick={collapseAll} className={styles.collapseButton}>Einklappen</button> 
            <div>
              <h3>Parts</h3>
              <div className={styles.partsRow}>
                {parts.map(part => (
                  <div key={part.id} className={styles.partItem} onClick={() => togglePart(part.id)}>
                    {part.imageUrl && <img src={part.imageUrl} alt={part.name} className={styles.partImage} />}
                    <span>{part.name}</span>
                  </div>
                ))}
              </div>
              {parts.map(part => (
                <div key={part.id}>
                  {openPartId === part.id && (
                    <div className={styles.partDetails}>
                      <h4>{part.name}</h4>
                      <h5>Lessons:</h5>
                      <ul>
                        {part.lessons.map(lesson => (
                          <li key={lesson.id}>
                            <div className={styles.lessonHeader} onClick={() => toggleLesson(lesson.id)}>
                              <span>{lesson.name}</span>
                            </div>
                            {openLessonId === lesson.id && (
                              <div className={styles.lessonDetails}>
                                <h6>Solos:</h6>
                                <ul>
                                  {lesson.solos.map(solo => (
                                    <li key={solo.id}>
                                      <div className={styles.soloHeader} onClick={() => toggleSolo(solo.id)}>
                                        <span>{solo.name} (Level: {solo.level})</span>
                                      </div>
                                      {openSoloId === solo.id && (
                                        <div className={styles.soloDetails}>
                                          <h6>Mixes:</h6>
                                          <ul>
                                            {solo.mixes.map(mix => (
                                              <li key={mix.id}>
                                                <div className={styles.mixHeader} onClick={() => toggleMix(mix.id)}>
                                                  <span>{mix.name} (Level: {mix.level})</span>
                                                </div>
                                                {openMixId === mix.id && (
                                                  <div className={styles.mixDetails}>
                                                    <h6>Tracks:</h6>
                                                    <ul>
                                                      {mix.tracks.map(track => (
                                                        <li key={track.id}>
                                                          <span>{track.name} (Current Track: {track.currentTrack})</span>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                )}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Please log in to view your details.</p>
        )}
      </div>
    </Layout>
  );
};

export default DrumPlayer;
