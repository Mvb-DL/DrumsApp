"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import Layout from '../components/Layout';

const AccountPage = () => {
  const { user, login } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
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
      login(result); // Update the user context with the new data
      setMessage('Account updated successfully');
      setPassword(''); // Clear the password field
    } else {
      setMessage('Failed to update account');
    }
  };

  return (
    <Layout>
      <div>
        {user ? (
          <div>
            <h1>Welcome, {user.firstName} {user.lastName}</h1>
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
