'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; 
import Layout from '../components/Layout'; 
import styles from './drumplayer.module.scss'; 

interface Part {
  id: number;
  name: string;
  imageUrl?: string; // Add this line
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
            <div>
              <h3>Parts</h3>
              <ul>
                {parts.map(part => (
                  <li key={part.id}>
                    <h4>{part.name}</h4>
                    {part.imageUrl && <img src={part.imageUrl} alt={part.name} className={styles.partImage} />} {/* Add this line */}
                    <div>
                      <h5>Lessons:</h5>
                      <ul>
                        {part.lessons.map(lesson => (
                          <li key={lesson.id}>
                            <h5>{lesson.name}</h5>
                            <div>
                              <h6>Solos:</h6>
                              <ul>
                                {lesson.solos.map(solo => (
                                  <li key={solo.id}>
                                    <h6>{solo.name} (Level: {solo.level})</h6>
                                    <div>
                                      <h6>Mixes:</h6>
                                      <ul>
                                        {solo.mixes.map(mix => (
                                          <li key={mix.id}>
                                            <h6>{mix.name} (Level: {mix.level})</h6>
                                            <div>
                                              <h6>Tracks:</h6>
                                              <ul>
                                                {mix.tracks.map(track => (
                                                  <li key={track.id}>{track.name} (Current Track: {track.currentTrack})</li>
                                                ))}
                                              </ul>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
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
