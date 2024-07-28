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
  const [selectedMix, setSelectedMix] = useState<Mix | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else if (user.role === 'admin') {
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
    setSelectedMix(null);
  };

  const toggleLesson = (lessonId: number) => {
    setOpenLessonId(openLessonId === lessonId ? null : lessonId);
    setOpenSoloId(null);
    setOpenMixId(null);
    setSelectedMix(null);
  };

  const toggleSolo = (soloId: number) => {
    setOpenSoloId(openSoloId === soloId ? null : soloId);
    setOpenMixId(null);
    setSelectedMix(null);
  };

  const toggleMix = (mixId: number, mix: Mix) => {
    setOpenMixId(openMixId === mixId ? null : mixId);
    setSelectedMix(openMixId === mixId ? null : mix);
  };

  const collapseAll = () => {
    setOpenPartId(null);
    setOpenLessonId(null);
    setOpenSoloId(null);
    setOpenMixId(null);
    setSelectedMix(null);
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
            <div className={selectedMix && user.role === 'Customer' ? styles.selectedPartContainer : styles.partsRow}>
              {parts.map(part => (
                (selectedMix && openPartId !== part.id && openPartId !== null) ? null : (
                  <div key={part.id} className={styles.partItem}>
                    <div onClick={() => togglePart(part.id)}>
                      {part.imageUrl && <img src={part.imageUrl} alt={part.name} className={styles.partImage} />}
                      <span>{part.name}</span>
                    </div>
                    {openPartId === part.id && (
                      <div className={styles.partDetails}>
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
                                                  <div className={styles.mixHeader} onClick={() => toggleMix(mix.id, mix)}>
                                                    <span>{mix.name} (Level: {mix.level})</span>
                                                  </div>
                                                  {openMixId === mix.id && user.role === 'Customer' && (
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
                )
              ))}
              {selectedMix && user.role === 'customer' && (
                <div className={styles.mixTableContainer}>
                  <h3>Selected Mix: {selectedMix.name}</h3>
                  <div className={styles.tableWrapper}>
                    <table className={styles.mixTable}>
                      <tbody>
                        {[...Array(8)].map((_, rowIndex) => (
                          <tr key={rowIndex}>
                            {[...Array(10)].map((_, colIndex) => {
                              const trackIndex = rowIndex * 10 + colIndex;
                              const track = selectedMix.tracks[trackIndex];
                              return (
                                <td key={colIndex}>
                                  {track ? `${track.name} (Current Track: ${track.currentTrack})` : ''}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Redirecting to login...</p>
        )}
      </div>
    </Layout>
  );
};

export default DrumPlayer;
