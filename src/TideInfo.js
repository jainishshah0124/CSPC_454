import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './chartSetup'; // Ensure the components are registered once

const TideInfo = ({ lat, lon }) => {
  const [tideData, setTideData] = useState([]);
  const [chartKey, setChartKey] = useState(0); // Key to force re-rendering

  useEffect(() => {
    const fetchTideData = async () => {
      try {
        // const response = await axios.get('/tideData.json'); 
        const baseUrl = 'https://server-dot-turing-diode-439622-f5.wl.r.appspot.com';
        // const baseUrl = 'http://localhost:8080';
        const response = await axios.get(`${baseUrl}/api/get-data`);
        var beaches = response.data;
        beaches=beaches[0].tide_data;
        const beachData = beaches.find(beach => beach.lat === parseFloat(lat));
        if (beachData && beachData.data && beachData.data.heights) {
          setTideData(beachData.data.heights);
          setChartKey((prevKey) => prevKey + 1);
        } else {
          console.warn('No data found for the provided latitude.');
        }
      } catch (error) {
        console.error('Error fetching tide information:', error);
      }
    };

    fetchTideData();
  }, [lat, lon]);

  const formatDataForGraph = () => {
    const labels = tideData.map((data) => {
      const date = new Date(data.dt * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    const heights = tideData.map((data) => data.height);

    return {
      labels,
      datasets: [
        {
          label: 'Tide Height (ft)',
          data: heights,
          borderColor: '#4A90E2',
          backgroundColor: 'rgba(74, 144, 226, 0.3)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  return (
    <div className="tide-info bg-gradient-to-r from-blue-300 to-blue-300 p-6 rounded-lg shadow-lg">
       <p className="text-center text-lg">Tide Information</p>

      {tideData.length > 0 && (
        <div className="mb-6">
          <Line key={chartKey} data={formatDataForGraph()} />
        </div>
      )}

      
    </div>
  );
};

export default TideInfo;
