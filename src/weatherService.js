// src/weatherService.js

import axios from 'axios';

const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
const baseUrl = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = async (city, units = 'metric') => {
  try {
    const response = await axios.get(`${baseUrl}/weather`, {
      params: {
        q: city,
        appid: apiKey,
        units: units,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather data:', error);
    throw error;
  }
};

export const getForecast = async (city, units = 'metric') => {
  try {
    const response = await axios.get(`${baseUrl}/forecast`, {
      params: {
        q: city,
        appid: apiKey,
        units: units,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

export const getCurrentWeatherByCoords = async (
  lat,
  lon,
  units = 'metric'
) => {
  try {
    const response = await axios.get(`${baseUrl}/weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: apiKey,
        units: units,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather by coordinates:', error);
    throw error;
  }
};
