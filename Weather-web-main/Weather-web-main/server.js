import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const PORT = Number(process.env.PORT || 5173);

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || '';

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());

app.use(
  express.json({
    limit: '256kb'
  })
);

/* =========================================================
   WEATHER HELPERS
========================================================= */

function degreesToDirection(degrees) {
  if (
    degrees == null ||
    Number.isNaN(Number(degrees))
  ) {
    return 'N/A';
  }

  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW'
  ];

  const index =
    Math.round(Number(degrees) / 22.5) % 16;

  return directions[index];
}


function weatherCodeToCondition(code) {
  const conditions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',

    45: 'Fog',
    48: 'Depositing rime fog',

    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',

    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',

    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',

    66: 'Light freezing rain',
    67: 'Heavy freezing rain',

    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',

    77: 'Snow grains',

    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',

    85: 'Slight snow showers',
    86: 'Heavy snow showers',

    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };

  return conditions[code] || 'Unknown';
}


/*
  Open-Meteo returns local timezone timestamps.

  Using new Date("2026-09-05T08:00")
  can cause the server timezone to shift the time.

  Therefore we extract the HH:MM directly.
*/
function formatTime(timeString) {
  if (!timeString) {
    return null;
  }

  const match =
    String(timeString).match(
      /T(\d{2}):(\d{2})/
    );

  if (!match) {
    return String(timeString);
  }

  const hour24 = Number(match[1]);
  const minute = match[2];

  const period =
    hour24 >= 12 ? 'PM' : 'AM';

  const hour12 =
    hour24 % 12 || 12;

  return `${hour12}:${minute} ${period}`;
}


/*
  Formats YYYY-MM-DD without timezone shifting.
*/
function formatDateLabel(dateString) {
  if (!dateString) {
    return null;
  }

  const match =
    String(dateString).match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (!match) {
    return String(dateString);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return date.toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    }
  );
}


function getIsWeekend(dateString) {
  if (!dateString) {
    return false;
  }

  const match =
    String(dateString).match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (!match) {
    return false;
  }

  const date = new Date(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3])
    )
  );

  const day = date.getUTCDay();

  return day === 0 || day === 6;
}


function formatHourlyLabel(timeString) {
  if (!timeString) {
    return '';
  }

  const match =
    String(timeString).match(
      /T(\d{2}):(\d{2})/
    );

  if (!match) {
    return String(timeString);
  }

  const hour24 = Number(match[1]);

  const period =
    hour24 >= 12 ? 'PM' : 'AM';

  const hour12 =
    hour24 % 12 || 12;

  return `${hour12} ${period}`;
}


function getVisibility(value, unit) {
  if (value == null) {
    return null;
  }

  const number =
    Number(value);

  if (Number.isNaN(number)) {
    return null;
  }

  if (unit === 'imperial') {
    return Number(
      (number / 1609.34).toFixed(1)
    );
  }

  return Number(
    (number / 1000).toFixed(1)
  );
}


/* =========================================================
   AIR QUALITY
========================================================= */

async function getAirQuality(
  latitude,
  longitude
) {
  try {
    const airQualityUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${encodeURIComponent(latitude)}` +
      `&longitude=${encodeURIComponent(longitude)}` +
      `&current=us_aqi` +
      `&timezone=auto`;

    const response =
      await fetch(
        airQualityUrl,
        {
          signal:
            AbortSignal.timeout(10000)
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    return (
      data?.current?.us_aqi ??
      null
    );
  } catch (error) {
    console.warn(
      'Air quality request failed:',
      error?.message || error
    );

    return null;
  }
}


/* =========================================================
   BUILD OPEN-METEO WEATHER URL
========================================================= */

function buildWeatherUrl(
  latitude,
  longitude,
  unit
) {
  const temperatureUnit =
    unit === 'imperial'
      ? 'fahrenheit'
      : 'celsius';

  const windSpeedUnit =
    unit === 'imperial'
      ? 'mph'
      : 'kmh';

  return (
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(latitude)}` +
    `&longitude=${encodeURIComponent(longitude)}` +

    `&current=` +
    [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'visibility',
      'uv_index'
    ].join(',') +

    `&hourly=` +
    [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'uv_index',
      'visibility'
    ].join(',') +

    `&daily=` +
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'precipitation_sum',
      'sunrise',
      'sunset',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'uv_index_max'
    ].join(',') +

    `&forecast_days=10` +
    `&forecast_hours=48` +
    `&timezone=auto` +
    `&temperature_unit=${temperatureUnit}` +
    `&wind_speed_unit=${windSpeedUnit}`
  );
}


/* =========================================================
   FORMAT COMPLETE WEATHER RESPONSE
========================================================= */

async function formatWeatherResponse(
  weatherData,
  location,
  unit,
  airQuality
) {
  const current =
    weatherData.current || {};

  const hourly =
    weatherData.hourly || {};

  const daily =
    weatherData.daily || {};

  /* -------------------------
     CURRENT VISIBILITY
  ------------------------- */

  const visibility =
    getVisibility(
      current.visibility,
      unit
    );

  /* -------------------------
     HOURLY
  ------------------------- */

  const hourlyTimes =
    Array.isArray(hourly.time)
      ? hourly.time
      : [];

  const hourlyForecast =
    hourlyTimes.map(
      (time, index) => ({
        time,

        label:
          formatHourlyLabel(time),

        temperature:
          hourly.temperature_2m?.[index] ??
          null,

        feelsLike:
          hourly.apparent_temperature?.[index] ??
          null,

        humidity:
          hourly.relative_humidity_2m?.[index] ??
          null,

        precipChance:
          hourly.precipitation_probability?.[index] ??
          null,

        precipitation:
          hourly.precipitation?.[index] ??
          null,

        condition:
          weatherCodeToCondition(
            hourly.weather_code?.[index]
          ),

        weatherCode:
          hourly.weather_code?.[index] ??
          null,

        windSpeed:
          hourly.wind_speed_10m?.[index] ??
          null,

        uv:
          hourly.uv_index?.[index] ??
          null,

        visibility:
          getVisibility(
            hourly.visibility?.[index],
            unit
          )
      })
    );

  /* -------------------------
     DAILY
  ------------------------- */

  const dailyTimes =
    Array.isArray(daily.time)
      ? daily.time
      : [];

  const forecast =
    dailyTimes.map(
      (date, index) => ({
        date,

        label:
          formatDateLabel(date),

        condition:
          weatherCodeToCondition(
            daily.weather_code?.[index]
          ),

        weatherCode:
          daily.weather_code?.[index] ??
          null,

        high:
          daily.temperature_2m_max?.[index] ??
          null,

        low:
          daily.temperature_2m_min?.[index] ??
          null,

        precipChance:
          daily.precipitation_probability_max?.[index] ??
          null,

        precipitation:
          daily.precipitation_sum?.[index] ??
          null,

        sunrise:
          formatTime(
            daily.sunrise?.[index]
          ),

        sunset:
          formatTime(
            daily.sunset?.[index]
          ),

        windSpeedMax:
          daily.wind_speed_10m_max?.[index] ??
          null,

        windGustMax:
          daily.wind_gusts_10m_max?.[index] ??
          null,

        uvMax:
          daily.uv_index_max?.[index] ??
          null,

        isWeekend:
          getIsWeekend(date)
      })
    );

  /* -------------------------
     FINAL RESPONSE
  ------------------------- */

  return {
    city:
      location.name ||
      'My Location',

    country:
      location.country ||
      null,

    countryCode:
      location.country_code ||
      null,

    admin1:
      location.admin1 ||
      null,

    latitude:
      Number(location.latitude),

    longitude:
      Number(location.longitude),

    elevation:
      location.elevation ??
      weatherData.elevation ??
      null,

    timezone:
      weatherData.timezone ||
      location.timezone ||
      null,

    timezoneAbbreviation:
      weatherData.timezone_abbreviation ||
      null,

    utcOffsetSeconds:
      weatherData.utc_offset_seconds ??
      null,

    unit,

    updatedAt:
      new Date().toISOString(),

    current: {
      temperature:
        current.temperature_2m ??
        null,

      feelsLike:
        current.apparent_temperature ??
        null,

      humidity:
        current.relative_humidity_2m ??
        null,

      windSpeed:
        current.wind_speed_10m ??
        null,

      windDir:
        degreesToDirection(
          current.wind_direction_10m
        ),

      windDirectionDegrees:
        current.wind_direction_10m ??
        null,

      visibility,

      pressure:
        current.pressure_msl ??
        null,

      uv:
        current.uv_index ??
        null,

      precipitation:
        current.precipitation ??
        null,

      aqi:
        airQuality,

      condition:
        weatherCodeToCondition(
          current.weather_code
        ),

      weatherCode:
        current.weather_code ??
        null,

      isDay:
        current.is_day ??
        null
    },

    hourly:
      hourlyForecast,

    daily:
      forecast
  };
}


/* =========================================================
   FETCH WEATHER FROM OPEN-METEO
========================================================= */

async function fetchWeatherForCoordinates(
  latitude,
  longitude,
  unit
) {
  const weatherUrl =
    buildWeatherUrl(
      latitude,
      longitude,
      unit
    );

  const weatherResponse =
    await fetch(
      weatherUrl,
      {
        signal:
          AbortSignal.timeout(15000)
      }
    );

  if (!weatherResponse.ok) {
    const errorText =
      await weatherResponse.text();

    throw new Error(
      `Weather request failed: ${weatherResponse.status} ${errorText.slice(
        0,
        300
      )}`
    );
  }

  const weatherData =
    await weatherResponse.json();

  const airQuality =
    await getAirQuality(
      latitude,
      longitude
    );

  return {
    weatherData,
    airQuality
  };
}


/* =========================================================
   CITY WEATHER ROUTE
========================================================= */

app.get(
  '/api/weather',
  async (req, res) => {
    try {
      const city =
        String(
          req.query.city ||
          'London'
        ).trim();

      const requestedUnit =
        String(
          req.query.unit ||
          'metric'
        ).toLowerCase();

      const unit =
        requestedUnit === 'imperial'
          ? 'imperial'
          : 'metric';

      if (!city) {
        return res.status(400).json({
          error:
            'City is required.'
        });
      }

      /* -------------------------
         GEOCODING
      ------------------------- */

      const geocodingUrl =
        `https://geocoding-api.open-meteo.com/v1/search` +
        `?name=${encodeURIComponent(city)}` +
        `&count=1` +
        `&language=en` +
        `&format=json`;

      const geocodingResponse =
        await fetch(
          geocodingUrl,
          {
            signal:
              AbortSignal.timeout(15000)
          }
        );

      if (!geocodingResponse.ok) {
        throw new Error(
          `Geocoding request failed: ${geocodingResponse.status}`
        );
      }

      const geocodingData =
        await geocodingResponse.json();

      if (
        !geocodingData.results ||
        geocodingData.results.length === 0
      ) {
        return res.status(404).json({
          error:
            `City "${city}" was not found.`
        });
      }

      const location =
        geocodingData.results[0];

      /* -------------------------
         WEATHER
      ------------------------- */

      const {
        weatherData,
        airQuality
      } =
        await fetchWeatherForCoordinates(
          location.latitude,
          location.longitude,
          unit
        );

      const result =
        await formatWeatherResponse(
          weatherData,
          location,
          unit,
          airQuality
        );

      return res.json(result);
    } catch (error) {
      console.error(
        'Weather API error:',
        error?.message || error
      );

      return res.status(500).json({
        error:
          error?.message ||
          'Unable to fetch weather data.'
      });
    }
  }
);


/* =========================================================
   DEVICE LOCATION WEATHER ROUTE
========================================================= */

app.get(
  '/api/weather/location',
  async (req, res) => {
    try {
      const latitude =
        Number(req.query.latitude);

      const longitude =
        Number(req.query.longitude);

      const requestedUnit =
        String(
          req.query.unit ||
          'metric'
        ).toLowerCase();

      const unit =
        requestedUnit === 'imperial'
          ? 'imperial'
          : 'metric';

      /* -------------------------
         VALIDATION
      ------------------------- */

      if (
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90
      ) {
        return res.status(400).json({
          error:
            'Invalid latitude.'
        });
      }

      if (
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
      ) {
        return res.status(400).json({
          error:
            'Invalid longitude.'
        });
      }

      /* -------------------------
         WEATHER
      ------------------------- */

      const {
        weatherData,
        airQuality
      } =
        await fetchWeatherForCoordinates(
          latitude,
          longitude,
          unit
        );

      /*
        We intentionally use "My Location"
        here because Open-Meteo weather
        does not provide reliable reverse
        geocoding.
      */

      const location = {
        name: 'My Location',
        latitude,
        longitude,
        country: null,
        country_code: null,
        admin1: null,
        elevation:
          weatherData.elevation ??
          null
      };

      const result =
        await formatWeatherResponse(
          weatherData,
          location,
          unit,
          airQuality
        );

      return res.json(result);
    } catch (error) {
      console.error(
        'Location weather error:',
        error?.message || error
      );

      return res.status(500).json({
        error:
          error?.message ||
          'Unable to fetch weather for your location.'
      });
    }
  }
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  '/api/health',
  (_req, res) => {
    res.json({
      ok: true,
      ai: Boolean(GEMINI_API_KEY),
      model: GEMINI_MODEL,
      weather: true
    });
  }
);


/* =========================================================
   AI HELPERS
========================================================= */

function isGreeting(message) {
  const text =
    String(message || '')
      .trim()
      .toLowerCase();

  return [
    'hi',
    'hello',
    'hey',
    'hey there',
    'hi there',
    'good morning',
    'good afternoon',
    'good evening'
  ].includes(text);
}


/* =========================================================
   LOCAL AI FALLBACK
========================================================= */

function localAnswer(
  message,
  weather
) {
  const text =
    String(message || '')
      .trim()
      .toLowerCase();

  const current =
    weather?.current || {};

  if (isGreeting(message)) {
    return (
      'Hello! 👋 I’m your weather assistant. ' +
      'Ask me anything about the current weather or forecast.'
    );
  }

  if (!weather || !current) {
    return (
      'I can help with weather questions. ' +
      'Please search for a city first so I have weather data to work with.'
    );
  }

  /* -------------------------
     TEMPERATURE
  ------------------------- */

  if (
    text.includes('temperature') ||
    text.includes('how hot') ||
    text.includes('how cold')
  ) {
    return (
      `The current temperature in ${weather.city} ` +
      `is ${current.temperature ?? 'N/A'}°. ` +
      `It feels like ${current.feelsLike ?? 'N/A'}°.`
    );
  }

  /* -------------------------
     CONDITION
  ------------------------- */

  if (
    text.includes('condition') ||
    text.includes('weather like') ||
    text.includes('weather right now')
  ) {
    return (
      `The current weather in ${weather.city} ` +
      `is ${current.condition ?? 'N/A'}, ` +
      `with a temperature of ${current.temperature ?? 'N/A'}°.`
    );
  }

  /* -------------------------
     HUMIDITY
  ------------------------- */

  if (
    text.includes('humidity') ||
    text.includes('humid')
  ) {
    return (
      `The current humidity in ${weather.city} ` +
      `is ${current.humidity ?? 'N/A'}%.`
    );
  }

  /* -------------------------
     WIND
  ------------------------- */

  if (text.includes('wind')) {
    return (
      `The wind in ${weather.city} is currently ` +
      `${current.windSpeed ?? 'N/A'} ` +
      `${weather.unit === 'imperial' ? 'mph' : 'km/h'} ` +
      `from the ${current.windDir ?? 'N/A'} direction.`
    );
  }

  /* -------------------------
     VISIBILITY
  ------------------------- */

  if (text.includes('visibility')) {
    return (
      `The current visibility in ${weather.city} ` +
      `is approximately ${current.visibility ?? 'N/A'} ` +
      `${weather.unit === 'imperial' ? 'miles' : 'km'}.`
    );
  }

  /* -------------------------
     PRESSURE
  ------------------------- */

  if (text.includes('pressure')) {
    return (
      `The current atmospheric pressure in ${weather.city} ` +
      `is ${current.pressure ?? 'N/A'} hPa.`
    );
  }

  /* -------------------------
     UV
  ------------------------- */

  if (
    text.includes('uv') ||
    text.includes('ultraviolet')
  ) {
    return (
      `The current UV index in ${weather.city} ` +
      `is ${current.uv ?? 'N/A'}.`
    );
  }

  /* -------------------------
     AIR QUALITY
  ------------------------- */

  if (
    text.includes('air quality') ||
    text.includes('aqi')
  ) {
    if (current.aqi == null) {
      return (
        `Air quality information is currently unavailable for ${weather.city}.`
      );
    }

    return (
      `The current US AQI in ${weather.city} ` +
      `is ${current.aqi}.`
    );
  }

  /* -------------------------
     RAIN
  ------------------------- */

  if (
    text.includes('rain') ||
    text.includes('precipitation')
  ) {
    const today =
      weather.daily?.[0];

    return (
      `Today's forecast for ${weather.city} is ` +
      `${today?.condition ?? 'N/A'}, ` +
      `with a ${today?.precipChance ?? 'N/A'}% ` +
      `chance of precipitation.`
    );
  }

  /* -------------------------
     TOMORROW
  ------------------------- */

  if (text.includes('tomorrow')) {
    const tomorrow =
      weather.daily?.[1];

    if (!tomorrow) {
      return (
        'Tomorrow’s forecast is currently unavailable.'
      );
    }

    return (
      `Tomorrow in ${weather.city}: ` +
      `${tomorrow.condition}, ` +
      `with a high of ${tomorrow.high}° ` +
      `and a low of ${tomorrow.low}°. ` +
      `There is a ${tomorrow.precipChance ?? 'N/A'}% ` +
      `chance of precipitation.`
    );
  }

  /* -------------------------
     HOURLY
  ------------------------- */

  if (
    text.includes('hourly') ||
    text.includes('next few hours')
  ) {
    const hourly =
      (weather.hourly || [])
        .slice(0, 6)
        .map(
          hour =>
            `${hour.label}: ${hour.temperature}°, ${hour.condition}, ${hour.precipChance ?? 'N/A'}% rain chance`
        )
        .join('\n');

    return (
      `Here is the upcoming hourly forecast for ${weather.city}:\n${hourly}`
    );
  }

  /* -------------------------
     FORECAST
  ------------------------- */

  if (
    text.includes('forecast') ||
    text.includes('next few days') ||
    text.includes('coming days')
  ) {
    const forecast =
      (weather.daily || [])
        .slice(0, 5)
        .map(
          day =>
            `${day.label}: ${day.condition}, high ${day.high}°, low ${day.low}°`
        )
        .join('\n');

    return (
      `Here’s the upcoming forecast for ${weather.city}:\n${forecast}`
    );
  }

  /* -------------------------
     DEFAULT
  ------------------------- */

  return (
    `For ${weather.city}, the current weather is ` +
    `${current.condition ?? 'N/A'} with a temperature of ` +
    `${current.temperature ?? 'N/A'}°. ` +
    `You can ask me about temperature, rain, wind, ` +
    `humidity, visibility, pressure, UV, air quality, ` +
    `hourly weather, or the forecast.`
  );
}


/* =========================================================
   GEMINI SYSTEM PROMPT
========================================================= */

function buildSystemPrompt(weather) {
  return `
You are a helpful weather assistant for a weather application.

Only use the weather information provided below when answering weather-related questions.

Current weather data:

${JSON.stringify(
  weather,
  null,
  2
)}

Be concise, friendly, and easy to understand.

If the user asks something that cannot be answered from the provided weather data, say so instead of making up information.

You can explain:

- current temperature
- feels-like temperature
- weather condition
- humidity
- wind
- wind direction
- visibility
- atmospheric pressure
- UV index
- air quality
- precipitation
- rain probability
- hourly forecast
- daily forecast
- sunrise
- sunset
- forecast highs and lows

Do not claim to have information that is not included in the weather data.
`;
}


/* =========================================================
   CONVERSATION HISTORY
========================================================= */

function normalizeHistory(
  conversation
) {
  if (!Array.isArray(conversation)) {
    return [];
  }

  return conversation
    .filter(item => {
      return (
        item &&
        typeof item === 'object' &&
        typeof item.role === 'string' &&
        typeof item.content === 'string'
      );
    })
    .slice(-10)
    .map(item => ({
      role:
        item.role === 'assistant'
          ? 'model'
          : 'user',

      parts: [
        {
          text:
            item.content.slice(
              0,
              4000
            )
        }
      ]
    }));
}


/* =========================================================
   GEMINI REQUEST
========================================================= */

async function callGemini(
  message,
  weather,
  conversation
) {
  const history =
    normalizeHistory(
      conversation
    );

  const body = {
    systemInstruction: {
      parts: [
        {
          text:
            buildSystemPrompt(
              weather
            )
        }
      ]
    },

    contents: [
      ...history,

      {
        role: 'user',

        parts: [
          {
            text: message
          }
        ]
      }
    ],

    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 600
    }
  };

  const response =
    await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        GEMINI_MODEL
      )}:generateContent`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          'x-goog-api-key':
            GEMINI_API_KEY
        },

        signal:
          AbortSignal.timeout(
            20000
          ),

        body:
          JSON.stringify(body)
      }
    );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Gemini API ${response.status}: ${errorText.slice(
        0,
        500
      )}`
    );
  }

  const data =
    await response.json();

  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map(
        part =>
          part.text || ''
      )
      .join('')
      .trim();

  if (!reply) {
    throw new Error(
      'Gemini returned an empty response.'
    );
  }

  return reply;
}


/* =========================================================
   AI ROUTE
========================================================= */

app.post(
  '/api/ai',
  async (req, res) => {
    try {
      const {
        message,
        weather,
        conversation = []
      } = req.body || {};

      if (
        !message ||
        typeof message !== 'string'
      ) {
        return res.status(400).json({
          error:
            'Message is required.'
        });
      }

      /* -------------------------
         GREETING
      ------------------------- */

      if (isGreeting(message)) {
        const greetReply =
          localAnswer(
            message,
            weather
          );

        return res.json({
          reply: greetReply,
          provider:
            'local-greeting'
        });
      }

      /* -------------------------
         LOCAL FALLBACK
      ------------------------- */

      if (!GEMINI_API_KEY) {
        return res.json({
          reply:
            localAnswer(
              message,
              weather
            ),

          provider:
            'local-fallback'
        });
      }

      /* -------------------------
         GEMINI
      ------------------------- */

      try {
        const reply =
          await callGemini(
            message,
            weather,
            conversation
          );

        return res.json({
          reply,
          provider: 'gemini',
          model:
            GEMINI_MODEL
        });
      } catch (error) {
        console.error(
          'Gemini error:',
          error?.message ||
            error
        );

        return res.json({
          reply:
            localAnswer(
              message,
              weather
            ),

          provider:
            'local-fallback',

          warning:
            error?.message ||
            'Gemini unavailable.'
        });
      }
    } catch (error) {
      console.error(
        'AI route error:',
        error?.message ||
          error
      );

      return res.status(500).json({
        error:
          error?.message ||
          'Unable to process AI request.'
      });
    }
  }
);


/* =========================================================
   SERVE REACT / VITE
========================================================= */

const distPath =
  path.join(
    __dirname,
    'dist'
  );

const isProduction =
  process.env.NODE_ENV ===
    'production' ||
  fs.existsSync(
    distPath
  );


/*
  IMPORTANT:
  API routes are defined ABOVE this
  SPA fallback, so /api/weather,
  /api/weather/location, /api/ai,
  etc. remain JSON endpoints.
*/

if (
  isProduction &&
  fs.existsSync(distPath)
) {
  app.use(
    express.static(
      distPath
    )
  );

  app.use(
    (_req, res) => {
      res.sendFile(
        path.join(
          distPath,
          'index.html'
        )
      );
    }
  );
} else {
  const vite =
    await createViteServer({
      root: __dirname,

      server: {
        middlewareMode: true,
        hmr: true
      },

      appType: 'spa'
    });

  app.use(
    vite.middlewares
  );
}


/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `Weather Hub running at http://0.0.0.0:${PORT}`
    );

    if (GEMINI_API_KEY) {
      console.log(
        `✅ AI enabled: ${GEMINI_MODEL}`
      );
    } else {
      console.log(
        '⚠️ AI running on local fallback — add GEMINI_API_KEY to .env to enable Gemini.'
      );
    }
  }
);