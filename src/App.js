// src/App.js

import React, { useState, useEffect } from 'react';
import {
  getCurrentWeather,
  getForecast,
  getCurrentWeatherByCoords,
} from './weatherService';
import './App.css';

function App() {
  const [city, setCity] = useState('Atlanta');
  const [query, setQuery] = useState('Atlanta');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentData = await getCurrentWeather(city, units);
        const forecast = await getForecast(city, units);
        setWeatherData(currentData);
        setForecastData(forecast);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('City not found. Please try another city.');
        } else {
          setError('An error occurred while fetching data.');
        }
        setWeatherData(null);
        setForecastData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, units]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== '') {
      setCity(query.trim());
    }
  };

  const handleUnitChange = (e) => {
    setUnits(e.target.value);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(true);
          setError(null);
          try {
            const data = await getCurrentWeatherByCoords(
              latitude,
              longitude,
              units
            );
            const forecast = await getForecast(
              `${data.name},${data.sys.country}`,
              units
            );
            setWeatherData(data);
            setForecastData(forecast);
            setCity(data.name);
            setQuery(data.name);
          } catch (err) {
            setError('An error occurred while fetching data.');
            setWeatherData(null);
            setForecastData(null);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError('Failed to get your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="container">
      <h1>Weather Dashboard</h1>

      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter city name"
        />
        <button onClick={handleSearch}>Get Weather</button>
        <button onClick={handleUseCurrentLocation}>Use My Location</button>
      </div>

      <div className="unit-toggle">
        <label>
          <input
            type="radio"
            value="metric"
            checked={units === 'metric'}
            onChange={handleUnitChange}
          />
          Celsius
        </label>
        <label>
          <input
            type="radio"
            value="imperial"
            checked={units === 'imperial'}
            onChange={handleUnitChange}
          />
          Fahrenheit
        </label>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && !error && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
          <p>
            {weatherData.weather[0].description.charAt(0).toUpperCase() +
              weatherData.weather[0].description.slice(1)}
          </p>
          <p>
            Temperature: {weatherData.main.temp}{' '}
            {units === 'metric' ? '°C' : '°F'}
          </p>
          <p>Humidity: {weatherData.main.humidity}%</p>
        </div>
      )}

      {forecastData && !error && (
        <div className="forecast">
          <h3>5-Day Forecast:</h3>
          <div className="forecast-container">
            {forecastData.list
              .filter((item) => item.dt_txt.includes('12:00:00'))
              .map((item, index) => (
                <div key={index} className="forecast-item">
                  <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                  />
                  <p>
                    {item.main.temp}{' '}
                    {units === 'metric' ? '°C' : '°F'}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
