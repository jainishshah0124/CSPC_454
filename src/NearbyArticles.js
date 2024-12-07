import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NearbyPlacesCarousel from './NearbyPlacesCarousel';

const NearbyArticles = ({ lat, lon }) => {
  const [nearbyArticles, setNearbyArticles] = useState([]);
  const [title,setTitles] = useState([]);

  useEffect(() => {
    const fetchNearbyArticles = async () => {
        if(lat && lon){
            try {
                const response = await axios.get(
                `https://en.wikipedia.org/w/api.php`, {
                params: {
                    action: 'query',
                    list: 'geosearch',
                    gscoord: `${lat}|${lon}`,
                    gsradius: 1000,
                    gslimit: 10,
                    format: 'json',
                    origin: '*',
                },
                });
                debugger;
                setNearbyArticles(response.data.query.geosearch);
                const fetchedTitles = response.data.query.geosearch.map(article => ({
                    title: article.title
                  }));
                  setTitles(fetchedTitles); 
            } catch (error) {
                console.error('Error fetching nearby articles:', error);
            }
        }
    };

    fetchNearbyArticles();
  }, [lat, lon]);

  return (
    <div>
      <h1 className="text-lg font-semibold mb-2">Nearby Places of Interest</h1>
      <NearbyPlacesCarousel places={title} />
    </div>
  );
};

export default NearbyArticles;