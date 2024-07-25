"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import Layout from '../components/Layout';
import { useRouter } from 'next/navigation';

const AccountPage = () => {
  const { user, login, logout } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.name || '');
  const [lastName, setLastName] = useState(user?.surname || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      id: user?.id,
      role: user?.role,
      firstName,
      lastName,
      password,
    };

    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      const result = await response.json();
      login(result); 
      setMessage('Account updated successfully');
      setPassword(''); 
    } else {
      setMessage('Failed to update account');
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/user?id=${user?.id}&role=${user?.role}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      logout();
      setMessage('Account deleted successfully');
      router.push('/'); // Redirect to the main page
    } else {
      setMessage('Failed to delete account');
    }
  };

  return (
    <Layout>
      <div>
        {user ? (
          <div>
            <h1>Welcome, {user.name} {user.surname}</h1>
            <p>Email: {user.email}</p>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">New Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit">Update Account</button>
            </form>
            <button onClick={handleDelete}>Delete Account</button>
            {message && <p>{message}</p>}
          </div>
        ) : (
          <p>No user is logged in.</p>
        )}
      </div>
    </Layout>
  );
};

export default AccountPage;
