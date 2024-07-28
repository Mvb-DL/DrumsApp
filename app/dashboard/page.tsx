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

  useEffect(() => {
    if (selectedPartId) {
      const selectedPart = parts.find((part) => part.id === selectedPartId);
      if (selectedPart) {
        setName(selectedPart.name);
      }
    } else {
      setName('');
    }
  }, [selectedPartId, parts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (selectedPartId) {
      formData.append('selectedPartId', selectedPartId.toString());
    }
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
      setSelectedPartId(newPart.id); 
      setNewPartName('');
      setImage(null); 
      setMessage('Part created successfully');
    } else {
      setMessage('Failed to create part');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {user ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.name} {user.surname}</h2>
            <div className="form-container">
              <h2 className="text-2xl font-bold mb-4">Neuen Part erstellen</h2>
              {parts.length < 6 ? (
                <form onSubmit={handleCreatePart} className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="newPartName" className="block text-sm font-medium text-gray-700">Neuer Partname:</label>
                    <input
                      type="text"
                      id="newPartName"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="form-group">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Bild:</label>
                      <div className="mt-1 flex items-center space-x-4">
                        <input
                          type="file"
                          id="image"
                          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                          required
                          className="block w-full text-sm tcursor-pointer focus:outline-none"
                        />
                        {image && (
                          <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden">
                            <img src={URL.createObjectURL(image)} alt="Selected" className="w-full h-full object-cover"/>
                          </div>
                        )}
                      </div>
                    </div>

                  <button type="submit" className="btn btn-primary part-button">Part erstellen</button>
                </form>
              ) : (
                <p>Maximum number of parts created</p>
              )}
              <h2 className="text-2xl font-bold mt-6 mb-4">Add Information to Part</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="selectedPartId" className="block text-sm font-medium text-gray-700">Select Part:</label>
                  <select
                    id="selectedPartId"
                    value={selectedPartId ?? ''}
                    onChange={(e) => setSelectedPartId(e.target.value ? parseInt(e.target.value) : null)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="" disabled>Select a Part</option>
                    {parts.map((part) => (
                      <option key={part.id} value={part.id}>{part.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Part Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lessonName" className="block text-sm font-medium text-gray-700">Lesson Name:</label>
                  <input
                    type="text"
                    id="lessonName"
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="soloName" className="block text-sm font-medium text-gray-700">Solo Name:</label>
                  <input
                    type="text"
                    id="soloName"
                    value={soloName}
                    onChange={(e) => setSoloName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="soloLevel" className="block text-sm font-medium text-gray-700">Solo Level:</label>
                  <input
                    type="number"
                    id="soloLevel"
                    value={soloLevel}
                    onChange={(e) => setSoloLevel(parseInt(e.target.value))}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mixName" className="block text-sm font-medium text-gray-700">Mix Name:</label>
                  <input
                    type="text"
                    id="mixName"
                    value={mixName}
                    onChange={(e) => setMixName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mixLevel" className="block text-sm font-medium text-gray-700">Mix Level:</label>
                  <input
                    type="number"
                    id="mixLevel"
                    value={mixLevel}
                    onChange={(e) => setMixLevel(parseInt(e.target.value))}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="trackName" className="block text-sm font-medium text-gray-700">Track Name:</label>
                  <input
                    type="text"
                    id="trackName"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentTrack" className="block text-sm font-medium text-gray-700">Current Track URL:</label>
                  <input
                    type="text"
                    id="currentTrack"
                    value={currentTrack}
                    onChange={(e) => setCurrentTrack(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="trackLevelName" className="block text-sm font-medium text-gray-700">Track Level Name:</label>
                  <input
                    type="text"
                    id="trackLevelName"
                    value={trackLevelName}
                    onChange={(e) => setTrackLevelName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                    <div className="form-group">
                      <label htmlFor="bpm" className="block text-sm font-medium text-gray-700">BPM:</label>
                      <div className="mt-1 flex items-center space-x-4">
                        <input
                          type="range"
                          id="bpm"
                          value={bpm}
                          min="0"
                          max="240"
                          onChange={(e) => setBpm(parseInt(e.target.value))}
                          required
                          className="block w-full"
                        />
                        <input
                          type="number"
                          id="bpm-number"
                          value={bpm}
                          min="0"
                          max="240"
                          onChange={(e) => setBpm(parseInt(e.target.value))}
                          required
                          className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>

                <div className="form-group">
                  <label htmlFor="instruments" className="block text-sm font-medium text-gray-700">Instrumente:</label>
                  <input
                    type="text"
                    id="instruments"
                    value={instruments}
                    onChange={(e) => setInstruments(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Create Part and Related Entities</button>
              </form>
              {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
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
