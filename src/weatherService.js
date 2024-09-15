import axios from 'axios';

const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
const baseUrl = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = async (city) => {
  try {
    const response = await axios.get(`${baseUrl}/weather`, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric', // 'imperial' for Fahrenheit
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
