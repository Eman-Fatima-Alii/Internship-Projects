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

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json({ limit: '256kb' }));

/* =========================================================
   WEATHER HELPERS
========================================================= */

function degreesToDirection(degrees) {
  if (degrees == null || Number.isNaN(Number(degrees))) {
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

  const index = Math.round(Number(degrees) / 22.5) % 16;
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

function formatTime(timeString) {
  if (!timeString) {
    return null;
  }

  try {
    const date = new Date(timeString);

    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch {
    return timeString;
  }
}

/* =========================================================
   WEATHER API
========================================================= */

app.get('/api/weather', async (req, res) => {
  try {
    const city = String(req.query.city || 'London').trim();

    const requestedUnit = String(req.query.unit || 'metric').toLowerCase();

    const unit =
      requestedUnit === 'imperial'
        ? 'imperial'
        : 'metric';

    if (!city) {
      return res.status(400).json({
        error: 'City is required.'
      });
    }

    /* -----------------------------------------------------
       STEP 1: Find the city coordinates
    ----------------------------------------------------- */

    const geocodingUrl =
      `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${encodeURIComponent(city)}` +
      `&count=1` +
      `&language=en` +
      `&format=json`;

    const geocodingResponse = await fetch(geocodingUrl, {
      signal: AbortSignal.timeout(15000)
    });

    if (!geocodingResponse.ok) {
      throw new Error(
        `Geocoding request failed: ${geocodingResponse.status}`
      );
    }

    const geocodingData = await geocodingResponse.json();

    if (
      !geocodingData.results ||
      geocodingData.results.length === 0
    ) {
      return res.status(404).json({
        error: `City "${city}" was not found.`
      });
    }

    const location = geocodingData.results[0];

    /* -----------------------------------------------------
       STEP 2: Get weather data
    ----------------------------------------------------- */

    const temperatureUnit =
      unit === 'imperial' ? 'fahrenheit' : 'celsius';

    const windSpeedUnit =
      unit === 'imperial' ? 'mph' : 'kmh';

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${encodeURIComponent(location.latitude)}` +
      `&longitude=${encodeURIComponent(location.longitude)}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,visibility,uv_index` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset` +
      `&forecast_days=10` +
      `&timezone=auto` +
      `&temperature_unit=${temperatureUnit}` +
      `&wind_speed_unit=${windSpeedUnit}`;

    const weatherResponse = await fetch(weatherUrl, {
      signal: AbortSignal.timeout(15000)
    });

    if (!weatherResponse.ok) {
      throw new Error(
        `Weather request failed: ${weatherResponse.status}`
      );
    }

    const weatherData = await weatherResponse.json();

    /* -----------------------------------------------------
       STEP 3: Get air quality
    ----------------------------------------------------- */

    let aqi = null;

    try {
      const airQualityUrl =
        `https://air-quality-api.open-meteo.com/v1/air-quality` +
        `?latitude=${encodeURIComponent(location.latitude)}` +
        `&longitude=${encodeURIComponent(location.longitude)}` +
        `&current=us_aqi` +
        `&timezone=auto`;

      const airQualityResponse = await fetch(airQualityUrl, {
        signal: AbortSignal.timeout(10000)
      });

      if (airQualityResponse.ok) {
        const airQualityData = await airQualityResponse.json();

        aqi =
          airQualityData?.current?.us_aqi ??
          null;
      }
    } catch (error) {
      console.warn(
        'Air quality request failed:',
        error?.message || error
      );
    }

    /* -----------------------------------------------------
       STEP 4: Format current weather
    ----------------------------------------------------- */

    const current = weatherData.current || {};

    let visibility = null;

    if (current.visibility != null) {
      visibility =
        unit === 'metric'
          ? Number(current.visibility) / 1000
          : Number(current.visibility) / 1609.34;

      visibility = Number(visibility.toFixed(1));
    }

    /* -----------------------------------------------------
       STEP 5: Format daily forecast
    ----------------------------------------------------- */

    const daily = weatherData.daily || {};

    const forecast = Array.isArray(daily.time)
      ? daily.time.map((date, index) => {
          const dateObject = new Date(`${date}T12:00:00`);

          return {
            date,

            label: dateObject.toLocaleDateString([], {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            }),

            condition: weatherCodeToCondition(
              daily.weather_code?.[index]
            ),

            high: daily.temperature_2m_max?.[index] ?? null,

            low: daily.temperature_2m_min?.[index] ?? null,

            precipChance:
              daily.precipitation_probability_max?.[index] ??
              null,

            sunrise: formatTime(
              daily.sunrise?.[index]
            ),

            sunset: formatTime(
              daily.sunset?.[index]
            ),

            isWeekend:
              dateObject.getDay() === 0 ||
              dateObject.getDay() === 6
          };
        })
      : [];

    /* -----------------------------------------------------
       STEP 6: Send response to frontend
    ----------------------------------------------------- */

    return res.json({
      city: location.name,
      country: location.country,

      latitude: location.latitude,
      longitude: location.longitude,

      timezone: weatherData.timezone,

      unit,

      current: {
        temperature: current.temperature_2m ?? null,

        feelsLike:
          current.apparent_temperature ?? null,

        humidity:
          current.relative_humidity_2m ?? null,

        windSpeed:
          current.wind_speed_10m ?? null,

        windDir: degreesToDirection(
          current.wind_direction_10m
        ),

        windDirectionDegrees:
          current.wind_direction_10m ?? null,

        visibility,

        pressure:
          current.pressure_msl ?? null,

        uv:
          current.uv_index ?? null,

        precipitation:
          current.precipitation ?? null,

        aqi,

        condition:
          weatherCodeToCondition(
            current.weather_code
          ),

        isDay:
          current.is_day ?? null
      },

      daily: forecast
    });

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
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    ai: Boolean(GEMINI_API_KEY),
    model: GEMINI_MODEL
  });
});

/* =========================================================
   AI HELPER FUNCTIONS
========================================================= */

function isGreeting(message) {
  const text = String(message || '')
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

function localAnswer(message, weather) {
  const text = String(message || '')
    .trim()
    .toLowerCase();

  const current = weather?.current || {};

  if (isGreeting(message)) {
    return 'Hello! 👋 I’m your weather assistant. Ask me anything about the current weather or forecast.';
  }

  if (!weather || !current) {
    return 'I can help with weather questions. Please search for a city first so I have weather data to work with.';
  }

  if (
    text.includes('temperature') ||
    text.includes('how hot') ||
    text.includes('how cold')
  ) {
    return `The current temperature in ${weather.city} is ${current.temperature ?? 'N/A'}°. It feels like ${current.feelsLike ?? 'N/A'}°.`;
  }

  if (
    text.includes('condition') ||
    text.includes('weather like') ||
    text.includes('weather right now')
  ) {
    return `The current weather in ${weather.city} is ${current.condition ?? 'N/A'}, with a temperature of ${current.temperature ?? 'N/A'}°.`;
  }

  if (
    text.includes('humidity') ||
    text.includes('humid')
  ) {
    return `The current humidity in ${weather.city} is ${current.humidity ?? 'N/A'}%.`;
  }

  if (
    text.includes('wind')
  ) {
    return `The wind in ${weather.city} is currently ${current.windSpeed ?? 'N/A'} ${weather.unit === 'imperial' ? 'mph' : 'km/h'} from the ${current.windDir ?? 'N/A'} direction.`;
  }

  if (
    text.includes('visibility')
  ) {
    return `The current visibility in ${weather.city} is approximately ${current.visibility ?? 'N/A'} ${weather.unit === 'imperial' ? 'miles' : 'km'}.`;
  }

  if (
    text.includes('pressure')
  ) {
    return `The current atmospheric pressure in ${weather.city} is ${current.pressure ?? 'N/A'} hPa.`;
  }

  if (
    text.includes('uv') ||
    text.includes('ultraviolet')
  ) {
    return `The current UV index in ${weather.city} is ${current.uv ?? 'N/A'}.`;
  }

  if (
    text.includes('air quality') ||
    text.includes('aqi')
  ) {
    if (current.aqi == null) {
      return `Air quality information is currently unavailable for ${weather.city}.`;
    }

    return `The current US AQI in ${weather.city} is ${current.aqi}.`;
  }

  if (
    text.includes('rain') ||
    text.includes('precipitation')
  ) {
    const forecast = weather.daily?.[0];

    return `Today's forecast for ${weather.city} is ${forecast?.condition ?? 'N/A'}, with a ${forecast?.precipChance ?? 'N/A'}% chance of precipitation.`;
  }

  if (
    text.includes('tomorrow')
  ) {
    const tomorrow = weather.daily?.[1];

    if (!tomorrow) {
      return 'Tomorrow’s forecast is currently unavailable.';
    }

    return `Tomorrow in ${weather.city}: ${tomorrow.condition}, with a high of ${tomorrow.high}° and a low of ${tomorrow.low}°. There is a ${tomorrow.precipChance ?? 'N/A'}% chance of precipitation.`;
  }

  if (
    text.includes('forecast') ||
    text.includes('next few days') ||
    text.includes('coming days')
  ) {
    const forecast = (weather.daily || [])
      .slice(0, 5)
      .map(
        day =>
          `${day.label}: ${day.condition}, high ${day.high}°, low ${day.low}°`
      )
      .join('\n');

    return `Here’s the upcoming forecast for ${weather.city}:\n${forecast}`;
  }

  return `For ${weather.city}, the current weather is ${current.condition ?? 'N/A'} with a temperature of ${current.temperature ?? 'N/A'}°. You can ask me about temperature, rain, wind, humidity, visibility, pressure, UV, air quality, or the forecast.`;
}

function buildSystemPrompt(weather) {
  return `
You are a helpful weather assistant for a weather application.

Only use the weather information provided below when answering weather-related questions.

Current weather data:

${JSON.stringify(weather, null, 2)}

Be concise, friendly, and easy to understand.

If the user asks something that cannot be answered from the provided weather data, say so instead of making up information.

You can explain weather conditions, temperatures, wind, humidity, visibility, pressure, UV index, air quality, precipitation, and forecasts.

Do not claim to have information that is not included in the weather data.
`;
}

function normalizeHistory(conversation) {
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
          text: item.content.slice(0, 4000)
        }
      ]
    }));
}

async function callGemini(
  message,
  weather,
  conversation
) {
  const history = normalizeHistory(conversation);

  const body = {
    systemInstruction: {
      parts: [
        {
          text: buildSystemPrompt(weather)
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      GEMINI_MODEL
    )}:generateContent`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },

      signal: AbortSignal.timeout(20000),

      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Gemini API ${response.status}: ${errorText.slice(
        0,
        500
      )}`
    );
  }

  const data = await response.json();

  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || '')
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

app.post('/api/ai', async (req, res) => {
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
        error: 'Message is required.'
      });
    }

    /* -----------------------------------------------------
       Greeting → local response
    ----------------------------------------------------- */

    if (isGreeting(message)) {
      const greetReply =
        localAnswer(message, weather);

      return res.json({
        reply: greetReply,
        provider: 'local-greeting'
      });
    }

    /* -----------------------------------------------------
       No Gemini key → local fallback
    ----------------------------------------------------- */

    if (!GEMINI_API_KEY) {
      return res.json({
        reply: localAnswer(message, weather),
        provider: 'local-fallback'
      });
    }

    /* -----------------------------------------------------
       Gemini
    ----------------------------------------------------- */

    try {
      const reply = await callGemini(
        message,
        weather,
        conversation
      );

      return res.json({
        reply,
        provider: 'gemini',
        model: GEMINI_MODEL
      });

    } catch (error) {
      console.error(
        'Gemini error:',
        error?.message || error
      );

      return res.json({
        reply: localAnswer(message, weather),
        provider: 'local-fallback',
        warning:
          error?.message ||
          'Gemini unavailable.'
      });
    }

  } catch (error) {
    console.error(
      'AI route error:',
      error?.message || error
    );

    return res.status(500).json({
      error:
        error?.message ||
        'Unable to process AI request.'
    });
  }
});

/* =========================================================
   SERVE FRONTEND
========================================================= */

const distPath = path.join(
  __dirname,
  'dist'
);

const isProduction =
  process.env.NODE_ENV === 'production' ||
  fs.existsSync(distPath);

if (
  isProduction &&
  fs.existsSync(distPath)
) {
  /* -------------------------------------------------------
     Production: serve Vite build
  ------------------------------------------------------- */

  app.use(
    express.static(distPath)
  );

  /* -------------------------------------------------------
     SPA fallback
  ------------------------------------------------------- */

  app.use((_req, res) => {
    res.sendFile(
      path.join(
        distPath,
        'index.html'
      )
    );
  });

} else {
  /* -------------------------------------------------------
     Development: Vite middleware
  ------------------------------------------------------- */

  const vite =
    await createViteServer({
      root: __dirname,

      server: {
        middlewareMode: true,
        hmr: true
      },

      appType: 'spa'
    });

  app.use(vite.middlewares);
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

    console.log(
      GEMINI_API_KEY
        ? `✅ AI enabled: ${GEMINI_MODEL}`
        : '⚠️ AI running on local fallback — add GEMINI_API_KEY to .env to enable Gemini.'
    );
  }
);