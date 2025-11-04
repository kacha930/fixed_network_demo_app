// src/DataDisplay.jsx
import React, { useState, useEffect } from 'react';

// Using the environment variable defined in .env.production
const API_URL = process.env.REACT_APP_API_URL;

function DataDisplay() { 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This will use the URL from the environment variable
    fetch(`${API_URL}/your_data_endpoint`) // ⚠️ Remember to change this endpoint!
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: Could not fetch data. ({error})</div>;

  return (
    <div>
      <h2>Data from Backend</h2>
      <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default DataDisplay; // Correct export name