import React, { useState, useEffect } from 'react';
import weatherData from './staticWeatherData.json';
import axios from 'axios';

const BeachWeather = ({ showWeather,lat,lon }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat: lat,              // Latitude of the beach
            lon: lon,              // Longitude of the beach
            appid: 'a9bf29a9863981938f4a81407f7bcf90'
          }
        });
        
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Only fetch weather data if `showWeather` is true
    if (showWeather && lat && lon) {
      fetchWeatherData();
    }
    debugger;
  }, [showWeather, lat, lon]);

  const getBackgroundClass = () => {
    if (!weather) return 'weather-container';
    const description = weather.weather[0].description.toLowerCase();

    if (description.includes('clear')) return 'weather-clear';
    if (description.includes('cloud')) return 'weather-cloudy';
    if (description.includes('rain')) return 'weather-rainy';
    return 'weather-container'; // Default
  };


  const convertUnixToTime = (unixTime) => {
    const timezoneOffset = 0
    const utcDate = new Date(unixTime * 1000);
    const localTime = new Date(utcDate.getTime() + timezoneOffset * 1000);
    return localTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  
  

  const kelvinToCelsius = (tempK) => {
    //return (tempK - 270.15).toFixed(1);
    return ((tempK - 273.15) * 1.8 + 34.5).toFixed(1);
  };

  return (
    <div className={`${getBackgroundClass()} bg-gradient-to-r text-white p-6 rounded-lg shadow-lg mb-6`}>
      {showWeather && weather ? (
        <div>
          {/* Raindrop animation if rainy */}
          {getBackgroundClass() === 'weather-rainy' && Array(50).fill().map((_, i) => (
            <div key={i} className="raindrop"></div>
          ))}

          {/* Top Section: City and Weather Icon */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">
                {weather.name}, {weather.sys.country}
              </h3>
              <p className="text-lg capitalize">{weather.weather[0].description}</p>
            </div>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
              className="w-16 h-16"
            />
          </div>

          {/* Temperature */}
          <div className="text-center mb-4">
            <p className="text-6xl font-semibold">
              {kelvinToCelsius(weather.main.temp)}°F
            </p>
            <p className="text-md">Feels Like: {kelvinToCelsius(weather.main.feels_like)}°F</p>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black bg-opacity-20 rounded-lg p-3 text-center">
              <p className="font-semibold">Humidity</p>
              <p>{weather.main.humidity}%</p>
            </div>
            <div className="bg-black bg-opacity-20 rounded-lg p-3 text-center">
              <p className="font-semibold">Wind Speed</p>
              <p>{weather.wind.speed} m/s</p>
            </div>
            <div className="bg-black bg-opacity-20 rounded-lg p-3 text-center">
              <p className="font-semibold">Cloudiness</p>
              <p>{weather.clouds.all}%</p>
            </div>
            <div className="bg-black bg-opacity-20 rounded-lg p-3 text-center">
              <p className="font-semibold">Pressure</p>
              <p>{weather.main.pressure} hPa</p>
            </div>
            <div className="bg-black bg-opacity-20 rounded-lg p-3 text-center">
              <p className="font-semibold">Sunrise</p>
              <p>{convertUnixToTime(weather.sys.sunrise)}</p>
            </div>
            <div className="bg-black bg-opacity-20 rounded-lg p-3 text-center">
              <p className="font-semibold">Sunset</p>
              <p>{convertUnixToTime(weather.sys.sunset)}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg">Click on the marker to see weather data...</p>
      )}
    </div>
  );
};

export default BeachWeather;