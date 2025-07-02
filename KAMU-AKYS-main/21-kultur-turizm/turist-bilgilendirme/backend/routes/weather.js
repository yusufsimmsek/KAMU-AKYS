import express from 'express';
import axios from 'axios';
import { config } from '../config/config.js';

const router = express.Router();

// Hava durumu bilgisi getir
router.get('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { lang = 'tr' } = req.query;

    if (!config.WEATHER_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'Hava durumu servisi kullanılamıyor'
      });
    }

    // OpenWeatherMap API'den hava durumu bilgisi al
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.WEATHER_API_KEY}&units=metric&lang=${lang}`
    );

    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${config.WEATHER_API_KEY}&units=metric&lang=${lang}`
    );

    const currentWeather = weatherResponse.data;
    const forecast = forecastResponse.data;

    // 5 günlük tahmin (günlük ortalama)
    const dailyForecast = [];
    const today = new Date().getDate();
    
    for (let i = 0; i < forecast.list.length; i += 8) { // Her 8 saat = 1 gün
      if (dailyForecast.length >= 5) break;
      
      const item = forecast.list[i];
      const date = new Date(item.dt * 1000);
      
      if (date.getDate() !== today || dailyForecast.length > 0) {
        dailyForecast.push({
          date: date.toISOString().split('T')[0],
          temp: {
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max)
          },
          weather: {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          },
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        });
      }
    }

    const weatherData = {
      current: {
        city: currentWeather.name,
        country: currentWeather.sys.country,
        temp: Math.round(currentWeather.main.temp),
        feelsLike: Math.round(currentWeather.main.feels_like),
        weather: {
          main: currentWeather.weather[0].main,
          description: currentWeather.weather[0].description,
          icon: currentWeather.weather[0].icon
        },
        humidity: currentWeather.main.humidity,
        pressure: currentWeather.main.pressure,
        windSpeed: currentWeather.wind.speed,
        windDirection: currentWeather.wind.deg,
        visibility: currentWeather.visibility,
        uvIndex: null, // UV indeksi için ayrı API çağrısı gerekir
        sunrise: new Date(currentWeather.sys.sunrise * 1000).toISOString(),
        sunset: new Date(currentWeather.sys.sunset * 1000).toISOString()
      },
      forecast: dailyForecast,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: weatherData
    });

  } catch (error) {
    console.error('Weather API error:', error);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Şehir bulunamadı'
      });
    }

    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: 'Hava durumu servisi geçici olarak kullanılamıyor'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Hava durumu bilgisi alınamadı'
    });
  }
});

// Koordinatlara göre hava durumu
router.get('/coordinates/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { lang = 'tr' } = req.query;

    if (!config.WEATHER_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'Hava durumu servisi kullanılamıyor'
      });
    }

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${config.WEATHER_API_KEY}&units=metric&lang=${lang}`
    );

    const currentWeather = weatherResponse.data;

    const weatherData = {
      current: {
        city: currentWeather.name,
        country: currentWeather.sys.country,
        temp: Math.round(currentWeather.main.temp),
        feelsLike: Math.round(currentWeather.main.feels_like),
        weather: {
          main: currentWeather.weather[0].main,
          description: currentWeather.weather[0].description,
          icon: currentWeather.weather[0].icon
        },
        humidity: currentWeather.main.humidity,
        pressure: currentWeather.main.pressure,
        windSpeed: currentWeather.wind.speed,
        coordinates: {
          lat: currentWeather.coord.lat,
          lng: currentWeather.coord.lon
        }
      },
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: weatherData
    });

  } catch (error) {
    console.error('Weather coordinates API error:', error);
    res.status(500).json({
      success: false,
      message: 'Hava durumu bilgisi alınamadı'
    });
  }
});

export default router; 