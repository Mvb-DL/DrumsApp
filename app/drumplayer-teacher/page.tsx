'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import styles from './drumplayer-teacher.module.scss';

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

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  trackId: number;
}

const DrumPlayerTeacher = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [openPartId, setOpenPartId] = useState<number | null>(null);
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);
  const [openSoloId, setOpenSoloId] = useState<number | null>(null);
  const [openMixId, setOpenMixId] = useState<number | null>(null);
  const [selectedMix, setSelectedMix] = useState<Mix | null>(null);
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '', password: '', trackId: '', teacherId: user?.id });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else if (user.role === 'admin') {
      router.push('/dashboard');
    } else {
      fetchStudents();
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

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/teachers/${user?.id}/students`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data: Student[] = await response.json();
      setStudents(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        setSuccess('Student added successfully!');
        setNewStudent({ firstName: '', lastName: '', email: '', password: '', trackId: '', teacherId: user?.id });
        fetchStudents();
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to add student');
      }
    } catch (error) {
      setError('Failed to add student');
    }
  };

  const togglePart = (partId: number) => {
    if (openPartId === partId) {
      setOpenPartId(null);
      setOpenLessonId(null);
      setOpenSoloId(null);
      setOpenMixId(null);
      setSelectedMix(null);
    } else {
      setOpenPartId(partId);
      setOpenLessonId(null);
      setOpenSoloId(null);
      setOpenMixId(null);
      setSelectedMix(null);
    }
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

  const openEmailForm = (email) => {
    setCurrentEmail(email);
    setShowEmailForm(true);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/teachers/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: currentEmail, subject: emailSubject, text: emailText }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess('Email sent successfully!');
        setPreviewUrl(result.previewUrl);
        window.open(result.previewUrl, '_blank');
        setShowEmailForm(false);
        setEmailSubject('');
        setEmailText('');
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to send email');
      }
    } catch (error) {
      setError('Failed to send email');
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
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
            {previewUrl && (
              <p>
                Preview your email <a href={previewUrl} target="_blank" rel="noopener noreferrer">here</a>.
              </p>
            )}
            <button onClick={collapseAll} className={styles.collapseButton}>Einklappen</button>
            <div className={selectedMix ? styles.selectedPartContainer : styles.partsRow}>
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
                )
              ))}
              {selectedMix && (
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
            <div className={styles.formContainer}>
              <h3>Add New Student</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={newStudent.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={newStudent.lastName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newStudent.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newStudent.password}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="trackId"
                  placeholder="Track ID"
                  value={newStudent.trackId}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit">Add Student</button>
              </form>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
            </div>
            <div className={styles.studentListContainer}>
              <h3>Registered Students</h3>
              <table className={styles.studentTable}>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Track ID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>{student.email}</td>
                      <td>{student.trackId}</td>
                      <td><button onClick={() => openEmailForm(student.email)}>Send Email</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showEmailForm && (
              <div className={styles.emailFormContainer}>
                <h3>Send Email to {currentEmail}</h3>
                <form onSubmit={sendEmail}>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    required
                  />
                  <textarea
                    name="text"
                    placeholder="Message"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    required
                  />
                  <button type="submit">Send Email</button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <p>Redirecting to login...</p>
        )}
      </div>
    </Layout>
  );
};

export default DrumPlayerTeacher;
