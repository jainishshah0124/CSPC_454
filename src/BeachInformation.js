import React, { useState } from 'react';

const BeachInformation = ({ beachData, beachdesc }) => {
  beachData=JSON.parse(beachData);
  beachdesc=beachdesc;
  const beach = beachData && beachData.results && beachData.results.length > 0 ? beachData.results[0] : null;
  console.log("Beach name --> "+beach);

  // Function to get the photo URL from Google Places API
  const getPhotoUrl = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=4000&photoreference=${photoReference}&key=AIzaSyC7iWcY4uYnqSYvzfCvxV4NwJZNsOPJGQk`;
  };

  // Initialize carousel state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Get all photo URLs
  const photoUrls = beachdesc && beachdesc.result && beachdesc.result.photos ? beachdesc.result.photos.map(photo => getPhotoUrl(photo.photo_reference)) : [];

  // Function to go to the next photo
  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photoUrls.length);
  };

  // Function to go to the previous photo
  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photoUrls.length) % photoUrls.length);
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-6">
      <div className="flex flex-col items-center">
        {/* Beach Name */}
        {beach && (
          <h2 className="text-3xl font-bold mb-4">{beach.name}</h2>
        )}

        {/* Photo Carousel */}
        {photoUrls.length > 0 && (
          <div className="relative w-full h-64">
            <img
              src={photoUrls[currentPhotoIndex]}
              alt={`Beach photo ${currentPhotoIndex + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            {/* Carousel Controls */}
            <button
              onClick={prevPhoto}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-black font-bold py-2 px-4 rounded-full shadow-md"
            >
              &#8249;
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-black font-bold py-2 px-4 rounded-full shadow-md"
            >
              &#8250;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeachInformation;
