"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path if necessary
import Layout from '../components/Layout'; // Adjust the path if necessary
import styles from './dashboard.module.scss'; // Assuming you have SCSS for styling

const Dashboard = () => {
    
  const { user } = useAuth();

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Admin Dashboard</h1>
        {user ? (
          <div>
            <h2>Welcome, {user.name} {user.surname}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            {/* Add any additional admin functionalities here */}
          </div>
        ) : (
          <p>Please log in to view your details.</p>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
