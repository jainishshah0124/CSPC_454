import React, { useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import BeachWeather from './BeachWeather';
import BeachInformation from './BeachInformation';
import axios from 'axios';
import TideInfo from './TideInfo';
import BeachDescription from './BeachDescription';
import NearbyArticles from './NearbyArticles';



const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 34.0522, // Latitude for Los Angeles, California
  lng: -118.2437 // Longitude for Los Angeles, California
};



const BeachInfo = () => {
    const [showWeather, setShowWeather] = useState(false);
    const [beachData, setBeachData] = useState(null);
    const [beachDesc, setBeachDesc] = useState(null);
    const [latt,setLatt] = useState(null);
    const [lngg,setLngg] = useState(null);
    const [beachname,setBeachName] = useState('');
  
    const onMapLoad = async(map) => {

        const baseUrl = 'https://server-dot-turing-diode-439622-f5.wl.r.appspot.com' ;
        // const baseUrl = 'http://localhost:8080' ;

        const response = await axios.get(`${baseUrl}/api/get-data`); //https://turing-diode-439622-f5.wl.r.appspot.com
        const beaches = response.data;
      const markers = beaches.map((markerData) => {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map,
          title: markerData.info,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });
  
        // Event listener for each marker click
        marker.addListener('click', async () => {
  
          // Fetch data from the Google Places API
          try {
            // Fetch nearby place details using latitude and longitude
            const nearbySearchResponse = await axios.get(
                `${baseUrl}/api/beach-info?lat=${markerData.lat}&lng=${markerData.lng}`
              );              
              const { nearby, details } = nearbySearchResponse.data;
              setBeachData(nearby);
              setBeachDesc(details);
              setLatt(markerData.lat);
              setLngg(markerData.lng);
              setBeachName(markerData.wiki);
              setShowWeather(true); // Show the weather information
          } catch (error) {
            console.error("Error fetching beach data:", error);
            alert("Failed to fetch beach data.");
          }
        });
  
        return marker;
      });
  
      // Initialize MarkerClusterer
      new MarkerClusterer({ markers, map });
    };

  return (
    <div className="bg-blue-100 min-h-screen p-6">

      <div className="flex">
        <div className="w-2/3 p-4">
          <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
            <BeachInformation beachData={beachData} beachdesc={beachDesc} />
            <BeachDescription beachName={beachname}/>
            <TideInfo lat={latt} lon={lngg} />
          </div>
        </div>

        <div className="w-1/3 p-4">
          <div className="bg-white p-4 rounded-lg shadow-lg h-full">
            <h2 className="text-lg font-semibold mb-2">California Map</h2>
            <LoadScript
              googleMapsApiKey="AIzaSyC7iWcY4uYnqSYvzfCvxV4NwJZNsOPJGQk"
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={9}
                onLoad={onMapLoad}
              />
            </LoadScript>
            <div>
            <BeachWeather showWeather={showWeather} lat={latt} lon={lngg} /></div>
            <div><NearbyArticles lat={latt} lon={lngg}/></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeachInfo;
