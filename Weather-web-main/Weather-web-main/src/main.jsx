import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Menu, Plus, X, Search, Bot, Send, Settings, Bell, User, HelpCircle,
  MapPin, Gauge, Maximize2, ChevronRight, RefreshCw,
  Thermometer, Check, Loader2, Trash2, Navigation,
  Droplets, Sunrise, Sunset, LocateFixed, Wind, Sun,
  Eye, Compass, Sparkles, Umbrella, CloudRain, Copy,
  CheckCheck, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import './styles.css';

/* ==========================================================================
   Illustrated Weather Icons System (High-Precision SVG)
   ========================================================================== */

function IconBase({ size = 24, className = '', children, viewBox = '0 0 64 64' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
    >
      {children}
    </svg>
  );
}

function SunIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round">
        <path d="M32 6v6M32 52v6M58 32h-6M12 32H6M50.4 13.6l-4.2 4.2M17.8 46.2l-4.2 4.2M50.4 50.4l-4.2-4.2M17.8 17.8l-4.2-4.2" />
      </g>
      <circle cx="32" cy="32" r="14" fill="url(#sunGlow)" stroke="#D97706" strokeWidth="1.5" />
    </IconBase>
  );
}

function MoonIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <path
        d="M44 8a22 22 0 1 0 12 38.6A22 22 0 0 1 44 8z"
        fill="url(#moonGrad)"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="24" r="2.2" fill="#64748B" opacity="0.6" />
      <circle cx="42" cy="34" r="1.6" fill="#64748B" opacity="0.5" />
      <circle cx="28" cy="38" r="1.8" fill="#64748B" opacity="0.6" />
    </IconBase>
  );
}

const cloudPuffPath = (fill, stroke) => (
  <path
    d="M18 44c-6.6 0-12-5.2-12-11.6 0-6 4.6-11 10.6-11.6C18.6 14.4 25 9.5 32.5 9.5c8 0 14.8 5.6 16.3 13.1 6 .8 10.7 5.9 10.7 12 0 6.7-5.6 12.2-12.5 12.2H18z"
    fill={fill}
    stroke={stroke}
    strokeWidth="1.5"
    strokeLinejoin="round"
  />
);

function CloudIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
      {cloudPuffPath('url(#cloudGrad)', '#94A3B8')}
    </IconBase>
  );
}

function CloudSunIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      <g stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round">
        <path d="M44 8v4.5M58 22h-4.5M28 14l3.2 3.2M54.8 14l-3.2 3.2" />
      </g>
      <circle cx="44" cy="22" r="9.5" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.2" />
      <path
        d="M14 48c-5.7 0-10.4-4.5-10.4-10 0-5.2 4-9.5 9.2-10 1.1-6.5 6.8-11.4 13.7-11.4 6.9 0 12.7 4.8 13.9 11.2 5.2.7 9.2 5.1 9.2 10.4 0 5.8-4.8 10.5-10.8 10.5H14z"
        fill="#F8FAFC"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function CloudMoonIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      <path d="M50 8a13 13 0 1 0 8.3 23A13 13 0 0 1 50 8z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M14 48c-5.7 0-10.4-4.5-10.4-10 0-5.2 4-9.5 9.2-10 1.1-6.5 6.8-11.4 13.7-11.4 6.9 0 12.7 4.8 13.9 11.2 5.2.7 9.2 5.1 9.2 10.4 0 5.8-4.8 10.5-10.8 10.5H14z"
        fill="#E2E8F0"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function CloudFogIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      <path
        d="M18 36c-6.1 0-11-4.7-11-10.5 0-5.4 4.2-9.9 9.6-10.4C17.5 9 23.4 4.5 30.4 4.5c7.2 0 13.3 5 14.7 11.8 5.4.7 9.6 5.3 9.6 10.8 0 3.2-1.4 6-3.7 8H18z"
        fill="#E2E8F0"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <g stroke="#94A3B8" strokeWidth="3" strokeLinecap="round">
        <path d="M10 44h44M14 51h36M18 58h28" />
      </g>
    </IconBase>
  );
}

function CloudDrizzleIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      {cloudPuffPath('#F1F5F9', '#94A3B8')}
      <g stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round">
        <path d="M22 50l-2 4M32 50l-2 4M42 50l-2 4" />
      </g>
    </IconBase>
  );
}

function CloudRainIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      {cloudPuffPath('#E2E8F0', '#94A3B8')}
      <g stroke="#0EA5E9" strokeWidth="3.2" strokeLinecap="round">
        <path d="M20 49l-3 7M32 49l-3 7M44 49l-3 7" />
      </g>
    </IconBase>
  );
}

function CloudRainWindIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      {cloudPuffPath('#CBD5E1', '#64748B')}
      <g stroke="#2563EB" strokeWidth="3.4" strokeLinecap="round">
        <path d="M18 48l-4 8M28 48l-4 8M38 48l-4 8M48 48l-3 6" />
      </g>
      <path d="M6 20h10M4 26h7" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" />
    </IconBase>
  );
}

function CloudSnowIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      {cloudPuffPath('#F8FAFC', '#94A3B8')}
      <g fill="#38BDF8">
        <circle cx="20" cy="52" r="2.6" />
        <circle cx="32" cy="55" r="2.6" />
        <circle cx="44" cy="52" r="2.6" />
      </g>
    </IconBase>
  );
}

function CloudLightningIcon({ size = 24, className = '' }) {
  return (
    <IconBase size={size} className={className}>
      <path
        d="M18 38c-6.1 0-11-4.7-11-10.5 0-5.4 4.2-9.9 9.6-10.4C17.5 11 23.4 6.5 30.4 6.5c7.2 0 13.3 5 14.7 11.8 5.4.7 9.6 5.3 9.6 10.8 0 5.4-4.5 9.9-10.1 9.9H18z"
        fill="#94A3B8"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M32 38l-7 13h6l-3 11 12-15h-6l4-9z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.2" strokeLinejoin="round" />
    </IconBase>
  );
}

const ICONS = {
  Sun: SunIcon,
  Moon: MoonIcon,
  CloudSun: CloudSunIcon,
  CloudMoon: CloudMoonIcon,
  Cloud: CloudIcon,
  CloudFog: CloudFogIcon,
  CloudDrizzle: CloudDrizzleIcon,
  CloudRain: CloudRainIcon,
  CloudRainWind: CloudRainWindIcon,
  CloudSnow: CloudSnowIcon,
  CloudLightning: CloudLightningIcon
};

const WMAP = {
  0: { label: 'Clear Sky', day: 'Sun', night: 'Moon' },
  1: { label: 'Mainly Clear', day: 'Sun', night: 'Moon' },
  2: { label: 'Partly Cloudy', day: 'CloudSun', night: 'CloudMoon' },
  3: { label: 'Overcast', day: 'Cloud', night: 'Cloud' },
  45: { label: 'Misty Fog', day: 'CloudFog', night: 'CloudFog' },
  48: { label: 'Depositing Rime Fog', day: 'CloudFog', night: 'CloudFog' },
  51: { label: 'Light Drizzle', day: 'CloudDrizzle', night: 'CloudDrizzle' },
  53: { label: 'Moderate Drizzle', day: 'CloudDrizzle', night: 'CloudDrizzle' },
  55: { label: 'Dense Drizzle', day: 'CloudDrizzle', night: 'CloudDrizzle' },
  56: { label: 'Freezing Drizzle', day: 'CloudDrizzle', night: 'CloudDrizzle' },
  57: { label: 'Heavy Freezing Drizzle', day: 'CloudDrizzle', night: 'CloudDrizzle' },
  61: { label: 'Slight Rain', day: 'CloudRain', night: 'CloudRain' },
  63: { label: 'Moderate Rain', day: 'CloudRain', night: 'CloudRain' },
  65: { label: 'Heavy Rain', day: 'CloudRainWind', night: 'CloudRainWind' },
  66: { label: 'Light Freezing Rain', day: 'CloudRain', night: 'CloudRain' },
  67: { label: 'Heavy Freezing Rain', day: 'CloudRain', night: 'CloudRain' },
  71: { label: 'Slight Snow Fall', day: 'CloudSnow', night: 'CloudSnow' },
  73: { label: 'Moderate Snow', day: 'CloudSnow', night: 'CloudSnow' },
  75: { label: 'Heavy Snow', day: 'CloudSnow', night: 'CloudSnow' },
  77: { label: 'Snow Grains', day: 'CloudSnow', night: 'CloudSnow' },
  80: { label: 'Slight Showers', day: 'CloudRain', night: 'CloudRain' },
  81: { label: 'Moderate Showers', day: 'CloudRain', night: 'CloudRain' },
  82: { label: 'Violent Showers', day: 'CloudRainWind', night: 'CloudRainWind' },
  85: { label: 'Slight Snow Showers', day: 'CloudSnow', night: 'CloudSnow' },
  86: { label: 'Heavy Snow Showers', day: 'CloudSnow', night: 'CloudSnow' },
  95: { label: 'Thunderstorm', day: 'CloudLightning', night: 'CloudLightning' },
  96: { label: 'Thunderstorm with Hail', day: 'CloudLightning', night: 'CloudLightning' },
  99: { label: 'Severe Thunderstorm & Hail', day: 'CloudLightning', night: 'CloudLightning' }
};

const DEFAULT_CITY = { id: 'newyork', name: 'New York', admin1: 'NY', country: 'United States', lat: 40.7128, lon: -74.006 };
const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

/* ==========================================================================
   Helper Functions
   ========================================================================== */

const round = (n) => Math.round(Number(n || 0));
const conditionOf = (code, isDay) => WMAP[code] || WMAP[isDay ? 1 : 0];
const iconFor = (code, isDay) => ICONS[conditionOf(code, isDay)?.[isDay ? 'day' : 'night']] || CloudIcon;
const degToCompass = (deg) => COMPASS[Math.round((Number(deg || 0) % 360) / 22.5) % 16];
const hpaToInHg = (hpa) => (Number(hpa || 0) * 0.02953).toFixed(2);
const cityKey = (c) => c.id || `${c.lat?.toFixed(2)},${c.lon?.toFixed(2)}`;

function weekdayLabel(dateStr, idx) {
  if (idx === 0) return 'Today';
  if (idx === 1) return 'Tomorrow';
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function fullWeekdayDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function timeLabel(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '--:--';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function hourLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric' }).replace(' ', '');
}

function getSkyVariantKey(code, isDay) {
  if (isDay === false) return 'clear-night';
  if (code === 0 || code === 1) return 'clear-day';
  if (code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if (code >= 71 && code <= 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'clear-day';
}

function describeBeaufort(speed, isMetric) {
  const kmh = isMetric ? speed : speed * 1.60934;
  if (kmh < 2) return 'Calm';
  if (kmh < 6) return 'Light Air';
  if (kmh < 12) return 'Light Breeze';
  if (kmh < 20) return 'Gentle Breeze';
  if (kmh < 29) return 'Moderate Breeze';
  if (kmh < 39) return 'Fresh Breeze';
  if (kmh < 50) return 'Strong Breeze';
  if (kmh < 62) return 'Near Gale';
  if (kmh < 75) return 'Gale';
  if (kmh < 89) return 'Strong Gale';
  return 'Storm Force';
}

function describeHumidityLevel(h) {
  if (h >= 80) return 'Oppressive Humidity';
  if (h >= 65) return 'High / Sticky';
  if (h >= 40) return 'Optimal Comfort';
  if (h >= 25) return 'Dry Air';
  return 'Extremely Dry';
}

function describePressureTrend(p) {
  const num = Number(p || 1013);
  if (num > 1022) return 'High / Fair Sky';
  if (num < 1005) return 'Low / Rain Likely';
  return 'Normal / Stable';
}

/* ==========================================================================
   Live Data API (Open-Meteo Integration)
   ========================================================================== */

async function geocodeCity(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Search failed');
  const j = await r.json();
  return (j.results || []).map(res => ({
    id: `${res.id}`,
    name: res.name,
    admin1: res.admin1 || '',
    country: res.country || '',
    lat: res.latitude,
    lon: res.longitude
  }));
}

async function fetchForecast(lat, lon, unit) {
  const tempUnit = unit === 'metric' ? 'celsius' : 'fahrenheit';
  const windUnit = unit === 'metric' ? 'kmh' : 'mph';
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure',
    hourly: 'temperature_2m,weather_code,precipitation_probability,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    timezone: 'auto',
    forecast_days: 10,
    temperature_unit: tempUnit,
    wind_speed_unit: windUnit
  });
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!r.ok) throw new Error('Forecast request failed');
  return r.json();
}

function normalizeWeather(raw, city, unit) {
  const now = new Date();
  const nowHourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
  const hourlyTimes = raw.hourly?.time || [];
  let nowIdx = hourlyTimes.findIndex(t => new Date(t) >= nowHourStart);
  if (nowIdx < 0) nowIdx = 0;

  const hourly = hourlyTimes.slice(nowIdx, nowIdx + 24).map((t, i) => {
    const idx = nowIdx + i;
    return {
      time: t,
      label: i === 0 ? 'Now' : hourLabel(t),
      temp: raw.hourly.temperature_2m[idx],
      code: raw.hourly.weather_code[idx],
      isDay: raw.hourly.is_day[idx] === 1,
      precipChance: raw.hourly.precipitation_probability?.[idx] ?? 0
    };
  });

  const precipWindowLabels = ['Evening', 'Night', 'Overnight', 'Early Morn'];
  const precipWindows = precipWindowLabels.map((label, w) => {
    const slice = hourlyTimes.slice(nowIdx + w * 6, nowIdx + w * 6 + 6);
    const probs = slice.map((_, i) => raw.hourly.precipitation_probability?.[nowIdx + w * 6 + i] ?? 0);
    const max = probs.length ? Math.max(...probs) : 0;
    return { label, chance: max };
  });

  const daily = (raw.daily?.time || []).map((d, i) => ({
    date: d,
    label: weekdayLabel(d, i),
    dateSub: fullWeekdayDate(d),
    code: raw.daily.weather_code[i],
    high: raw.daily.temperature_2m_max[i],
    low: raw.daily.temperature_2m_min[i],
    precipChance: raw.daily.precipitation_probability_max?.[i] ?? 0,
    sunrise: timeLabel(raw.daily.sunrise[i]),
    sunset: timeLabel(raw.daily.sunset[i]),
    sunriseRaw: raw.daily.sunrise[i],
    sunsetRaw: raw.daily.sunset[i],
    isWeekend: [0, 6].includes(new Date(`${d}T00:00:00`).getDay())
  }));

  const cur = raw.current || {};
  const cond = conditionOf(cur.weather_code, cur.is_day === 1);

  return {
    city: city.name,
    admin1: city.admin1,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
    timezone: raw.timezone,
    tzAbbr: raw.timezone_abbreviation,
    unit,
    fetchedAt: Date.now(),
    current: {
      temperature: cur.temperature_2m,
      feelsLike: cur.apparent_temperature,
      humidity: cur.relative_humidity_2m,
      windSpeed: cur.wind_speed_10m,
      windDir: degToCompass(cur.wind_direction_10m),
      windDeg: cur.wind_direction_10m,
      pressure: hpaToInHg(cur.surface_pressure),
      pressureHpa: cur.surface_pressure,
      condition: cond.label,
      code: cur.weather_code,
      isDay: cur.is_day === 1
    },
    hourly,
    precipWindows,
    daily
  };
}

/* ==========================================================================
   Atmospheric Weather Particle Canvas Overlay
   ========================================================================== */

function WeatherParticleCanvas({ code, isDay }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Determine particle effect mode based on weather code
    const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
    const isSnow = code >= 71 && code <= 86;
    const isStorm = code >= 95;
    const isClearNight = !isDay && (code === 0 || code === 1);

    const particles = [];
    const count = isRain ? 60 : isSnow ? 50 : isClearNight ? 45 : 20;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 14 + 10,
        speed: Math.random() * 8 + 4,
        radius: Math.random() * 2.2 + 0.8,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    let stormFlashTimer = 0;
    let isFlashing = false;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Distant lightning flash for storm condition
      if (isStorm) {
        stormFlashTimer++;
        if (stormFlashTimer > 320 && Math.random() < 0.03) {
          isFlashing = true;
          stormFlashTimer = 0;
          setTimeout(() => { isFlashing = false; }, 90);
        }
        if (isFlashing) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.fillRect(0, 0, width, height);
        }
      }

      for (let p of particles) {
        if (isRain || isStorm) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.length);
          ctx.stroke();

          p.y += p.speed;
          p.x -= 0.8;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        } else if (isSnow) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(240, 249, 255, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speed * 0.25;
          p.x += Math.sin(p.y * 0.02) * 0.6;
          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        } else if (isClearNight) {
          p.twinklePhase += p.twinkleSpeed;
          const currentOpacity = 0.2 + 0.6 * Math.abs(Math.sin(p.twinklePhase));
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
          ctx.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Ambient soft dust/sun shimmer
          p.y -= 0.2;
          ctx.beginPath();
          ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity * 0.25})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [code, isDay]);

  return <canvas ref={canvasRef} className="weather-particle-canvas" aria-hidden="true" />;
}

/* ==========================================================================
   Visual Temperature Range Bar (Apple Weather Style)
   ========================================================================== */

function DailyRangeBar({ low, high, weekMin, weekMax }) {
  const span = Math.max(weekMax - weekMin, 1);
  const leftPct = Math.max(0, Math.min(100, ((low - weekMin) / span) * 100));
  const widthPct = Math.max(6, Math.min(100 - leftPct, ((high - low) / span) * 100));

  return (
    <div className="daily-range-bar-track">
      <div
        className="daily-range-bar-fill"
        style={{
          left: `${leftPct.toFixed(1)}%`,
          width: `${widthPct.toFixed(1)}%`
        }}
      />
    </div>
  );
}

/* ==========================================================================
   Sun Path Astronomical Arc Visualization
   ========================================================================== */

function SunPathArc({ sunrise, sunset, sunriseRaw, sunsetRaw }) {
  const now = new Date();
  let progressPct = 50;

  if (sunriseRaw && sunsetRaw) {
    const riseTime = new Date(sunriseRaw).getTime();
    const setTime = new Date(sunsetRaw).getTime();
    const currentTime = now.getTime();

    if (currentTime <= riseTime) progressPct = 0;
    else if (currentTime >= setTime) progressPct = 100;
    else progressPct = ((currentTime - riseTime) / (setTime - riseTime)) * 100;
  }

  // Calculate coordinates on SVG parabolic arc
  const t = Math.max(0, Math.min(1, progressPct / 100));
  const svgX = 20 + t * 240;
  // Parabola: y = -4 * h * t * (1 - t) + base
  const svgY = 85 - 4 * 65 * t * (1 - t);

  return (
    <div className="sun-arc-wrapper">
      <svg className="sun-arc-svg" viewBox="0 0 280 100">
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Horizon Baseline */}
        <line x1="10" y1="85" x2="270" y2="85" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
        {/* Parabolic Sun Trajectory Arc */}
        <path d="M 20 85 Q 140 -20 260 85" fill="none" stroke="url(#arcGrad)" strokeWidth="2.5" strokeDasharray="4 3" />
        {/* Sun Position Indicator */}
        <circle cx={svgX} cy={svgY} r="7" fill="#FBBF24" stroke="#FFF" strokeWidth="2" filter="drop-shadow(0 0 8px #F59E0B)" />
      </svg>
      <div className="sun-times-row">
        <div className="sun-time-block">
          <Sunrise size={16} />
          <div>
            <b>{sunrise || '--:--'}</b>
            <small>Sunrise</small>
          </div>
        </div>
        <div className="sun-time-block" style={{ textAlign: 'right' }}>
          <Sunset size={16} />
          <div>
            <b>{sunset || '--:--'}</b>
            <small>Sunset</small>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Modals & Drawers Components
   ========================================================================== */

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="aerocast-toast-wrapper">
      <div className="toast-status-icon"><Check size={14} /></div>
      <div className="toast-message-content">
        <b>{toast.title}</b>
        <small>{toast.text}</small>
      </div>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, wide = false }) {
  return (
    <div className="aerocast-modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={`aerocast-modal-window ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true">
        <div className="modal-header-section">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-action-btn" aria-label="Close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-content-body">{children}</div>
      </div>
    </div>
  );
}

function SearchModal({ onClose, onPick }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!q.trim()) { setResults([]); setErr(''); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const r = await geocodeCity(q.trim());
        setResults(r);
        setErr(r.length ? '' : 'No matching cities found.');
      } catch {
        setErr('Search request failed. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }, 380);
    return () => clearTimeout(timer.current);
  }, [q]);

  return (
    <Modal title="Add Location" subtitle="Search any city or metropolitan area worldwide for real-time telemetry." onClose={onClose}>
      <div className="modal-search-field">
        <Search size={16} color="var(--text-muted)" />
        <input
          autoFocus
          placeholder="e.g. London, Tokyo, San Francisco, Lahore..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        {loading && <Loader2 className="spinner-icon" size={16} />}
      </div>
      {err && <div style={{ color: 'var(--text-muted)', fontSize: '12.5px', textAlign: 'center', margin: '8px 0' }}>{err}</div>}
      <div className="search-results-list">
        {results.map(c => (
          <button key={c.id} className="search-result-row" onClick={() => onPick(c)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} color="var(--accent-cyan)" />
              <div>
                <b>{c.name}</b>
                <small>{[c.admin1, c.country].filter(Boolean).join(', ')}</small>
              </div>
            </div>
            <ChevronRight size={15} color="var(--text-muted)" />
          </button>
        ))}
      </div>
    </Modal>
  );
}

function SidebarDrawer({ open, onClose, cities, activeId, onSelect, onRemove, onOpenSearch, onNav }) {
  return (
    <>
      <div className={`sidebar-drawer-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`sidebar-drawer-panel ${open ? 'is-open' : ''}`}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="brand-icon-wrapper" style={{ width: '28px', height: '28px' }}>
              <CloudSunIcon size={18} />
            </div>
            <b style={{ fontSize: '15px', color: '#fff' }}>AeroCast Hub</b>
          </div>
          <button className="icon-action-btn" onClick={onClose} aria-label="Close sidebar"><X size={17} /></button>
        </div>

        <button className="header-search-bar" style={{ maxWidth: '100%', marginBottom: '14px' }} onClick={onOpenSearch}>
          <Search size={15} /> Search worldwide cities...
        </button>

        <div className="drawer-section-heading">Saved Locations</div>
        <div className="drawer-locations-list">
          {cities.map(c => (
            <div
              className={`drawer-city-item ${cityKey(c) === activeId ? 'is-active' : ''}`}
              key={cityKey(c)}
              onClick={() => onSelect(c)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={15} color={cityKey(c) === activeId ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                <div>
                  <b style={{ fontSize: '13.5px' }}>{c.name}</b>
                  <small style={{ color: 'var(--text-muted)' }}>{[c.admin1, c.country].filter(Boolean).join(', ')}</small>
                </div>
              </div>
              {cities.length > 1 && (
                <button
                  className="icon-action-btn"
                  style={{ width: '28px', height: '28px' }}
                  onClick={(e) => { e.stopPropagation(); onRemove(c); }}
                  aria-label="Remove location"
                >
                  <Trash2 size={13} color="var(--accent-rose)" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="drawer-section-heading">System Navigation</div>
        <div className="drawer-nav-list">
          <button className="drawer-nav-btn" onClick={() => onNav('settings')}><Settings size={16} /> Dashboard Settings</button>
          <button className="drawer-nav-btn" onClick={() => onNav('notifications')}><Bell size={16} /> Atmospheric Alerts</button>
          <button className="drawer-nav-btn" onClick={() => onNav('help')}><HelpCircle size={16} /> Intelligence Guide</button>
          <button className="drawer-nav-btn" onClick={() => onNav('profile')}><User size={16} /> User Profile</button>
        </div>
      </aside>
    </>
  );
}

/* ==========================================================================
   AI Copilot Chat Widget Component
   ========================================================================== */

function CopilotWidget({ open, setOpen, messages, input, setInput, onSend, loading }) {
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  const promptSuggestions = [
    '☂️ Do I need an umbrella today?',
    '🧥 What should I wear right now?',
    '🏃 Is it good for outdoor running?',
    '📅 Give me the 7-day outlook',
    '💨 What are the wind conditions?'
  ];

  return (
    <>
      <button className="ai-copilot-launcher" onClick={() => setOpen(v => !v)} aria-label="Toggle WeatherAI Assistant">
        {open ? <X size={20} /> : <Bot size={20} />}
        <span>{open ? 'Close Copilot' : 'WeatherAI Copilot'}</span>
      </button>

      {open && (
        <div className="copilot-panel-drawer">
          <div className="copilot-header">
            <div className="copilot-brand-title">
              <div className="copilot-avatar"><Bot size={17} /></div>
              <div>
                <b>WeatherAI Copilot</b>
                <small>Meteorologist & Atmosphere Specialist</small>
              </div>
            </div>
            <button className="icon-action-btn" style={{ width: '30px', height: '30px' }} onClick={() => setOpen(false)} aria-label="Close panel">
              <X size={15} />
            </button>
          </div>

          <div className="copilot-chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot chat-typing-dots">
                <span /><span /><span />
              </div>
            )}
          </div>

          <div className="copilot-suggestions-bar">
            {promptSuggestions.map((prompt, idx) => (
              <button key={idx} className="prompt-chip" onClick={() => onSend(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form className="copilot-input-form" onSubmit={e => { e.preventDefault(); onSend(input); }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about rain, wind, clothing, UV..."
            />
            <button type="submit" className="copilot-send-btn" disabled={!input.trim() || loading} aria-label="Send query">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/* ==========================================================================
   Main Application Root
   ========================================================================== */

function App() {
  const [cities, setCities] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rw-cities') || 'null') || [DEFAULT_CITY]; }
    catch { return [DEFAULT_CITY]; }
  });
  const [activeId, setActiveId] = useState(() => localStorage.getItem('rw-active') || cityKey(DEFAULT_CITY));
  const [unit, setUnit] = useState(() => localStorage.getItem('rw-unit') || 'imperial');
  const [weatherByCity, setWeatherByCity] = useState({});
  const [loadingActive, setLoadingActive] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [clockTick, setClockTick] = useState(0);
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rw-notifications') || '[]'); } catch { return []; }
  });

  const activeCity = useMemo(() => cities.find(c => cityKey(c) === activeId) || cities[0], [cities, activeId]);
  const weather = weatherByCity[activeId];

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Greetings! I am your WeatherAI Copilot. Ask me anything about precipitation probability, wind velocities, outfit guidance, or weekly meteorological forecasts.' }
  ]);

  const notify = useCallback((title, text) => {
    setToast({ title, text });
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => setToast(null), 3200);
  }, []);

  const addNotification = useCallback((title, text) => {
    const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title, text, time: new Date().toISOString(), read: false };
    setNotifications(prev => [item, ...prev].slice(0, 20));
  }, []);

  useEffect(() => { localStorage.setItem('rw-cities', JSON.stringify(cities)); }, [cities]);
  useEffect(() => { localStorage.setItem('rw-active', activeId); }, [activeId]);
  useEffect(() => { localStorage.setItem('rw-unit', unit); }, [unit]);
  useEffect(() => { localStorage.setItem('rw-notifications', JSON.stringify(notifications)); }, [notifications]);

  // Global Keyboard Shortcuts (e.g. "/" or "Ctrl+K" for search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timezone-aware local clock ticker
  useEffect(() => {
    const t = setInterval(() => setClockTick(x => x + 1), 15000);
    return () => clearInterval(t);
  }, []);

  const clockFor = useCallback((w) => {
    if (!w) return '';
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: w.timezone,
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit'
      }).format(new Date());
      return `${parts} (${w.tzAbbr || ''})`.trim();
    } catch { return ''; }
  }, []);

  const loadCity = useCallback(async (city, { silent } = {}) => {
    const key = cityKey(city);
    if (!silent) setLoadingActive(true);
    try {
      const raw = await fetchForecast(city.lat, city.lon, unit);
      const norm = normalizeWeather(raw, city, unit);
      setWeatherByCity(prev => ({ ...prev, [key]: norm }));
      if (norm.precipWindows.some(p => p.chance >= 60) && !silent) {
        addNotification('Precipitation Alert', `${norm.city} has high precipitation probability in the coming hours.`);
      }
      return norm;
    } catch (e) {
      notify('Unable to sync live weather', 'Please check your connection and retry.');
    } finally {
      if (!silent) setLoadingActive(false);
    }
  }, [unit, notify, addNotification]);

  // Load city on mount or change
  useEffect(() => {
    if (activeCity) loadCity(activeCity);
  }, [activeId, unit]);

  // Background refresh every 10 mins
  useEffect(() => {
    const t = setInterval(() => { if (activeCity) loadCity(activeCity, { silent: true }); }, 10 * 60 * 1000);
    return () => clearInterval(t);
  }, [activeCity, loadCity]);

  const selectCity = (city) => {
    const key = cityKey(city);
    setActiveId(key);
    setSidebarOpen(false);
    notify(`Switched to ${city.name}`, 'Live atmospheric telemetry updated.');
  };

  const addCity = (city) => {
    const key = cityKey(city);
    setCities(prev => (prev.some(c => cityKey(c) === key) ? prev : [...prev, { ...city, id: key }]));
    setActiveId(key);
    setSearchOpen(false);
    setSidebarOpen(false);
    notify('Location Saved', `${city.name} added to your active weather fleet.`);
  };

  const removeCity = (city) => {
    const key = cityKey(city);
    setCities(prev => {
      const next = prev.filter(c => cityKey(c) !== key);
      if (activeId === key && next.length) setActiveId(cityKey(next[0]));
      return next;
    });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return notify('Not Supported', 'Geolocation is not available in this browser.');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const city = { id: `me-${latitude.toFixed(2)}-${longitude.toFixed(2)}`, name: 'My Location', admin1: '', country: '', lat: latitude, lon: longitude };
      addCity(city);
    }, () => notify('Location Unavailable', 'Could not access device coordinates.'));
  };

  // Weather query detection in chat
  const resolveWeatherTarget = useCallback(async (text) => {
    const query = String(text || '').trim();
    if (!query) return { weatherData: weather, detectedCity: null };
    const lower = query.toLowerCase();

    const savedMatch = cities.find(city => {
      const named = city.name?.toLowerCase() || '';
      return named.length > 1 && lower.includes(named);
    });

    if (savedMatch) {
      const key = cityKey(savedMatch);
      const data = weatherByCity[key] || await loadCity(savedMatch, { silent: true });
      return { weatherData: data || weather, detectedCity: savedMatch.name };
    }

    const patterns = [
      /(?:weather|temperature|temp|forecast|rain|climate|humidity|wind)\s+(?:of|in|at|for|near)\s+([a-zA-Z][a-zA-Z\s-]+?)(?:\s+(?:now|today|tomorrow|tonight|this week|right now|currently))?\s*\??$/i,
      /(?:of|in|at|for|near)\s+([a-zA-Z][a-zA-Z\s-]+?)(?:\s+(?:now|today|tomorrow|tonight|this week|right now|currently))?\s*\??$/i,
      /^([a-zA-Z][a-zA-Z\s-]+?)\s+(?:ka|ki|ke|kya|mai|mein|main|men)\s+(?:weather|temperature|temp|forecast|rain|humidity|wind)/i,
      /^(?:what(?:'s|\s+is)?|how(?:'s|\s+is)?|show|tell|get|check)\s+(?:the\s+)?(?:weather|temperature|temp|forecast|rain|humidity|wind)\s+(?:of|in|at|for|near)\s+([a-zA-Z][a-zA-Z\s-]+?)(?:\s+(?:now|today|tomorrow|tonight))?\s*\??$/i,
    ];

    let cityCandidate = '';
    for (const pat of patterns) {
      const match = lower.match(pat);
      if (match && match[1]) {
        cityCandidate = match[1].trim();
        if (cityCandidate.length > 1) break;
      }
    }

    if (!cityCandidate) {
      const stopWords = /\b(what|whats|how|is|are|was|will|does|do|can|the|a|an|it|of|in|at|for|on|to|from|with|by|and|but|not|no|yes|rain|wind|weather|temperature|temp|forecast|hot|cold|warm|cool|humid|snow|degree|degrees|celsius|fahrenheit|wear|today|tomorrow|now|tonight|please|tell|show|get|give|feels|feel|very|really|right|currently|about|near)\b/gi;
      cityCandidate = lower.replace(stopWords, ' ').replace(/[^a-zA-Z\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    if (!cityCandidate || cityCandidate.length < 2) return { weatherData: weather, detectedCity: null };

    try {
      const geocoded = await geocodeCity(cityCandidate);
      const city = geocoded[0];
      if (!city) return { weatherData: weather, detectedCity: `❌ ${cityCandidate}` };
      const key = cityKey(city);
      const data = weatherByCity[key] || await loadCity(city, { silent: true });
      return { weatherData: data || weather, detectedCity: city.name };
    } catch {
      return { weatherData: weather, detectedCity: `❌ ${cityCandidate}` };
    }
  }, [cities, loadCity, weather, weatherByCity]);

  const buildWeatherPayload = useCallback((w) => {
    if (!w) return null;
    return {
      city: w.city,
      unit: w.unit,
      current: {
        temperature: w.current.temperature,
        feelsLike: w.current.feelsLike,
        humidity: w.current.humidity,
        windSpeed: w.current.windSpeed,
        windDir: w.current.windDir,
        pressure: w.current.pressure,
        condition: w.current.condition
      },
      daily: w.daily.map(d => ({
        label: d.label,
        condition: conditionOf(d.code, true).label,
        high: d.high,
        low: d.low,
        precipChance: d.precipChance,
        sunrise: d.sunrise,
        sunset: d.sunset,
        isWeekend: d.isWeekend
      }))
    };
  }, []);

  // Client-Side Expert Answer Engine (Local Fallback)
  const localAnswerClient = useCallback((message, w) => {
    const q = String(message || '').trim().toLowerCase();
    const c = w?.current || {};
    const daily = w?.daily || [];
    const city = w?.city || 'your location';
    const isMetric = w?.unit === 'metric';
    const unitSymbol = isMetric ? '°C' : '°F';
    const speedUnit = isMetric ? 'km/h' : 'mph';
    const today = daily[0];
    const tomorrow = daily[1];
    const rnd = n => Math.round(Number(n || 0));

    // Greetings
    if (/^(hi|hello|hey+|hiya|yo|salam|salaam|assalam[- ]?o?[- ]?alaikum|aoa|good\s*(morning|afternoon|evening|night)|hola|bonjour|hallo|مرحبا|سلام|ہیلو)\s*[!.?]*$/i.test(q)) {
      const t = rnd(c.temperature);
      const feels = rnd(c.feelsLike);
      const cond = (c.condition || 'Clear');
      return `Hello! 👋 Right now in **${city}** it's **${t}${unitSymbol}** with **${cond}**, feeling like **${feels}${unitSymbol}**. Ask me anything about precipitation probability, outfit advice, wind speed, or weekly forecasts!`;
    }

    // Rain / Umbrella
    if (/umbrella|will it rain|rain today|chance of rain|is it going to rain|precipitation/i.test(q)) {
      const chance = today?.precipChance ?? 0;
      if (chance >= 70) return `☔ **Yes, definitely bring an umbrella.** There is a **${chance}% chance of precipitation** in ${city} today — rain is almost certain.`;
      if (chance >= 40) return `🌂 **Carrying an umbrella is recommended.** The rain probability in ${city} is **${chance}%** — scattered showers are likely.`;
      if (chance >= 15) return `🌦️ **Slight possibility of showers (${chance}%)** in ${city}. You may skip the umbrella unless outside for prolonged hours.`;
      return `☀️ **No umbrella needed.** The chance of precipitation in ${city} is only **${chance}%** today.`;
    }

    // What to wear
    if (/what.*wear|dress|outfit|clothing|jacket|coat|attire|how.*dress/i.test(q)) {
      const t = rnd(c.temperature);
      const feels = rnd(c.feelsLike);
      const rain = today?.precipChance ?? 0;
      const rainNote = rain >= 40 ? '\n🌂 **Waterproof layer recommended** — high rain likelihood.' : '';
      let outfit = '';
      if (feels <= (isMetric ? 0 : 32)) outfit = '🧥 **Heavy winter parka**, thermal base layer, warm scarf, and gloves.';
      else if (feels <= (isMetric ? 10 : 50)) outfit = '🧥 **Warm coat or fleece jacket** with full-length trousers.';
      else if (feels <= (isMetric ? 18 : 64)) outfit = '🧣 **Light jacket, sweater, or hoodie** over casual layers.';
      else if (feels <= (isMetric ? 26 : 78)) outfit = '👕 **T-shirt and light trousers/chinos**. Very pleasant conditions.';
      else outfit = '🩳 **Breathable summer clothing** (cotton/linen). Keep hydrated under direct sun.';
      return `**Clothing advice for ${city} (${t}${unitSymbol}, feels like ${feels}${unitSymbol}):**\n\n${outfit}${rainNote}`;
    }

    // Temperature
    if (/\btemp(erature)?\b|how hot|how cold|how warm|degrees|thermometer/i.test(q)) {
      const t = rnd(c.temperature);
      const feels = rnd(c.feelsLike);
      const hi = rnd(today?.high);
      const lo = rnd(today?.low);
      return `**Temperature in ${city}:**\n\n🌡️ Currently **${t}${unitSymbol}** (feels like **${feels}${unitSymbol}**)\n📈 High: **${hi}${unitSymbol}** · 📉 Low: **${lo}${unitSymbol}**`;
    }

    // Weekly forecast
    if (/week|7.?day|next.*day|forecast|coming day/i.test(q)) {
      if (!daily.length) return `Extended forecast data is not available yet for ${city}.`;
      const lines = daily.slice(0, 7).map(d => `• **${d.label}:** ${d.condition || 'Clear'} (${rnd(d.high)}${unitSymbol}/${rnd(d.low)}${unitSymbol}) — 🌧️ ${d.precipChance}%`).join('\n');
      return `**7-Day Forecast for ${city}:**\n\n${lines}`;
    }

    // Generic fallback
    const t = rnd(c.temperature);
    const feels = rnd(c.feelsLike);
    return `**${city} Telemetry:** ${c.condition || 'Clear'} · **${t}${unitSymbol}** (feels like ${feels}${unitSymbol}) · 💧 ${rnd(c.humidity)}% humidity · 💨 ${rnd(c.windSpeed)} ${speedUnit} · 🌧️ ${today?.precipChance ?? 0}% rain chance.\n\nAsk me about rain, what to wear, weekly forecast, wind speeds, or astronomical cycles!`;
  }, []);

  const sendChat = async (text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const isGreetingMsg = /^(hi|hello|hey+|hiya|yo|salam|salaam|assalam[- ]?o?[- ]?alaikum|aoa|good\s*(morning|afternoon|evening|night)|hola|bonjour|hallo|مرحبا|سلام|ہیلو)\s*[!.?]*$/i.test(trimmed);
      const { weatherData: targetWeather, detectedCity } = isGreetingMsg
        ? { weatherData: weather, detectedCity: null }
        : await resolveWeatherTarget(trimmed);

      if (detectedCity && detectedCity.startsWith('❌')) {
        const badCity = detectedCity.slice(2).trim();
        setMessages(prev => [...prev, { role: 'bot', text: `Sorry, I couldn't resolve atmospheric data for "${badCity}". Please verify spelling or try another city.` }]);
        return;
      }

      const activeWeather = buildWeatherPayload(targetWeather || weather);
      let reply = null;

      try {
        const r = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(12000),
          body: JSON.stringify({
            message: trimmed,
            weather: activeWeather,
            conversation: messages.slice(-8)
          })
        });
        if (r.ok) {
          const j = await r.json();
          reply = j.reply || null;
        }
      } catch {
        // Backend unavailable -> fallback to rich local client engine
      }

      if (!reply) {
        reply = localAnswerClient(trimmed, targetWeather || weather);
      }
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch {
      const fallback = localAnswerClient(trimmed, weather);
      setMessages(prev => [...prev, { role: 'bot', text: fallback }]);
    } finally {
      setChatLoading(false);
    }
  };

  const clock = clockFor(weather);
  const skyVariant = getSkyVariantKey(weather?.current?.code, weather?.current?.isDay ?? true);
  const u = unit === 'metric' ? '°' : '°';
  const speedUnit = unit === 'metric' ? 'km/h' : 'mph';

  // Calculate week min/max for daily range bars
  const weekTemps = useMemo(() => {
    if (!weather?.daily?.length) return { min: 0, max: 100 };
    const lows = weather.daily.map(d => Number(d.low || 0));
    const highs = weather.daily.map(d => Number(d.high || 0));
    return { min: Math.min(...lows), max: Math.max(...highs) };
  }, [weather]);

  const mapEmbedSrc = useMemo(() => {
    if (!weather) return '';
    return `https://www.openstreetmap.org/export/embed.html?bbox=${weather.lon - 0.38}%2C${weather.lat - 0.25}%2C${weather.lon + 0.38}%2C${weather.lat + 0.25}&layer=mapnik&marker=${weather.lat}%2C${weather.lon}`;
  }, [weather]);

  const CurrentIcon = weather ? iconFor(weather.current.code, weather.current.isDay) : SunIcon;

  return (
    <div className="aerocast-shell" data-sky-variant={skyVariant}>
      {/* Dynamic Atmospheric Canvas & Aurora Backing */}
      <div className="aerocast-backdrop">
        <div className="aurora-layer">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>
        <WeatherParticleCanvas code={weather?.current?.code} isDay={weather?.current?.isDay ?? true} />
        <div className="mesh-grid-overlay" />
      </div>

      {/* Top Navigation Bar */}
      <header className="aerocast-header">
        <div className="header-brand-group">
          <button className="header-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open navigation drawer">
            <Menu size={18} />
          </button>
          <div className="brand-logo">
            <div className="brand-icon-wrapper">
              <CloudSunIcon size={20} />
            </div>
            <span className="brand-title">
              AeroCast
              <span className="brand-badge">PRO</span>
            </span>
          </div>
        </div>

        {/* Search trigger */}
        <div className="header-search-bar" onClick={() => setSearchOpen(true)}>
          <Search size={14} />
          <span>Search cities worldwide...</span>
          <kbd>Ctrl K</kbd>
        </div>

        {/* Saved Cities Quick Switch Chips */}
        <div className="header-city-chips">
          {cities.slice(0, 4).map(c => {
            const isSelected = cityKey(c) === activeId;
            const cityTemp = weatherByCity[cityKey(c)]?.current?.temperature;
            return (
              <button
                key={cityKey(c)}
                className={`city-chip ${isSelected ? 'active' : ''}`}
                onClick={() => selectCity(c)}
              >
                <span>{c.name}</span>
                {cityTemp !== undefined && (
                  <span className="city-chip-temp font-numeric">{round(cityTemp)}°</span>
                )}
              </button>
            );
          })}
          <button className="icon-action-btn" style={{ width: '30px', height: '30px' }} onClick={() => setSearchOpen(true)} aria-label="Add city">
            <Plus size={15} />
          </button>
        </div>

        {/* Controls Right */}
        <div className="header-actions-group">
          <div className="unit-switch-pill">
            <button
              className={`unit-switch-btn ${unit === 'imperial' ? 'active' : ''}`}
              onClick={() => setUnit('imperial')}
            >
              °F
            </button>
            <button
              className={`unit-switch-btn ${unit === 'metric' ? 'active' : ''}`}
              onClick={() => setUnit('metric')}
            >
              °C
            </button>
          </div>

          <button className="icon-action-btn" onClick={useMyLocation} title="Use My Current Location" aria-label="Use my location">
            <LocateFixed size={17} />
          </button>

          <button
            className={`icon-action-btn ${notifications.some(n => !n.read) ? 'active' : ''}`}
            onClick={() => setModal('notifications')}
            title="Atmospheric Alerts"
            aria-label="Alerts"
          >
            <Bell size={17} />
            {notifications.some(n => !n.read) && <span className="notif-badge-dot" />}
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="aerocast-main">
        {loadingActive && !weather ? (
          <div className="loading-dashboard-state">
            <Loader2 size={36} className="spinner-icon" />
            <b style={{ fontSize: '16px', color: '#fff' }}>Connecting to Satellite Telemetry...</b>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Retrieving high-resolution Open-Meteo atmospheric models</span>
          </div>
        ) : weather ? (
          <>
            {/* Hero Weather Condition Card */}
            <section className="hero-condition-card">
              <div className="hero-card-grid">
                {/* Left: Location & Primary Temperature */}
                <div className="hero-location-header">
                  <div className="location-meta-row">
                    <span className="location-name">{weather.city}</span>
                    {weather.country && <span className="location-region-tag">{[weather.admin1, weather.country].filter(Boolean).join(', ')}</span>}
                    <span className="location-time-badge">
                      <span className="live-pulse-dot" />
                      {clock}
                    </span>
                  </div>

                  <div className="hero-temp-showcase">
                    <div className="hero-temp-large font-numeric">
                      {round(weather.current.temperature)}
                      <span className="hero-temp-unit font-numeric">{u}</span>
                    </div>

                    <div className="hero-condition-summary">
                      <div className="condition-pill-badge">
                        <CurrentIcon size={22} />
                        <span>{weather.current.condition}</span>
                      </div>
                      <div className="feels-like-text">
                        Feels like <strong className="font-numeric">{round(weather.current.feelsLike)}{u}</strong>
                      </div>
                      <div className="hero-highlow-bar">
                        <span className="highlow-item high font-numeric">
                          <ArrowUpRight size={15} /> High {round(weather.daily[0]?.high)}{u}
                        </span>
                        <span className="highlow-item low font-numeric">
                          <ArrowDownRight size={15} /> Low {round(weather.daily[0]?.low)}{u}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Telemetry Tiles Grid */}
                <div className="hero-telemetry-grid">
                  <div className="telemetry-tile">
                    <div className="telemetry-head">
                      <span>Humidity</span>
                      <Droplets size={16} />
                    </div>
                    <div className="telemetry-val font-numeric">
                      {round(weather.current.humidity)}<small>%</small>
                    </div>
                    <div className="telemetry-note">{describeHumidityLevel(weather.current.humidity)}</div>
                  </div>

                  <div className="telemetry-tile">
                    <div className="telemetry-head">
                      <span>Wind Velocity</span>
                      <Wind size={16} />
                    </div>
                    <div className="telemetry-val font-numeric">
                      {round(weather.current.windSpeed)}<small>{speedUnit}</small>
                    </div>
                    <div className="telemetry-note">{describeBeaufort(weather.current.windSpeed, unit === 'metric')} • {weather.current.windDir}</div>
                  </div>

                  <div className="telemetry-tile">
                    <div className="telemetry-head">
                      <span>Barometer</span>
                      <Gauge size={16} />
                    </div>
                    <div className="telemetry-val font-numeric">
                      {weather.current.pressure}<small>inHg</small>
                    </div>
                    <div className="telemetry-note">{describePressureTrend(weather.current.pressureHpa)}</div>
                  </div>

                  <div className="telemetry-tile">
                    <div className="telemetry-head">
                      <span>Rain Likelihood</span>
                      <Umbrella size={16} />
                    </div>
                    <div className="telemetry-val font-numeric">
                      {weather.daily[0]?.precipChance ?? 0}<small>%</small>
                    </div>
                    <div className="telemetry-note">
                      {(weather.daily[0]?.precipChance ?? 0) >= 40 ? 'Umbrella Advised' : 'Dry Forecast'}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Hourly Forecast Interactive Strip */}
            <section className="dashboard-section-card">
              <div className="section-header-row">
                <div className="section-title-group">
                  <Sparkles size={16} />
                  <span>24-Hour Atmospheric Timeline</span>
                </div>
                <span className="section-tagline">Hourly temperature & precipitation probability</span>
              </div>

              <div className="hourly-timeline-container">
                {weather.hourly.map((h, i) => {
                  const HourIcon = iconFor(h.code, h.isDay);
                  return (
                    <div className={`hourly-item-card ${i === 0 ? 'is-now' : ''}`} key={h.time + i}>
                      <span className="hourly-time-label">{h.label}</span>
                      <HourIcon size={22} />
                      <span className="hourly-temp-label font-numeric">{round(h.temp)}{u}</span>
                      {h.precipChance > 0 && (
                        <span className="hourly-precip-badge font-numeric">
                          <Droplets size={10} />
                          {h.precipChance}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Two-Column Split: 7-Day Extended Forecast + Intelligence Cards */}
            <div className="dashboard-content-split">
              {/* Left: 7 to 10 Day Extended Forecast with Apple-Style Range Bars */}
              <section className="dashboard-section-card">
                <div className="section-header-row">
                  <div className="section-title-group">
                    <Sun size={16} />
                    <span>7-Day Extended Outlook</span>
                  </div>
                  <span className="section-tagline">Min/Max temperature span</span>
                </div>

                <div className="extended-forecast-list">
                  {weather.daily.slice(0, 7).map((d, i) => {
                    const DayIcon = iconFor(d.code, true);
                    return (
                      <div className={`daily-row-item ${i === 0 ? 'is-today' : ''}`} key={d.date}>
                        <div className="daily-day-label">
                          {d.label}
                          <small>{d.dateSub}</small>
                        </div>
                        <DayIcon size={20} />
                        <div className="daily-rain-chance font-numeric">
                          {d.precipChance > 10 ? `${d.precipChance}%` : ''}
                        </div>
                        <DailyRangeBar
                          low={d.low}
                          high={d.high}
                          weekMin={weekTemps.min}
                          weekMax={weekTemps.max}
                        />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <span className="daily-temp-low font-numeric">{round(d.low)}°</span>
                          <span className="daily-temp-high font-numeric">{round(d.high)}°</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Right: Weather Intelligence Cards */}
              <div className="intelligence-column">
                {/* Sun Path Astronomical Arc */}
                <section className="dashboard-section-card">
                  <div className="section-header-row">
                    <div className="section-title-group">
                      <Sunrise size={16} />
                      <span>Astronomical Cycle</span>
                    </div>
                    <span className="section-tagline">Daylight Trajectory</span>
                  </div>
                  <SunPathArc
                    sunrise={weather.daily[0]?.sunrise}
                    sunset={weather.daily[0]?.sunset}
                    sunriseRaw={weather.daily[0]?.sunriseRaw}
                    sunsetRaw={weather.daily[0]?.sunsetRaw}
                  />
                </section>

                {/* Wind Dynamics & Compass Dial */}
                <section className="dashboard-section-card">
                  <div className="section-header-row">
                    <div className="section-title-group">
                      <Compass size={16} />
                      <span>Wind & Dynamics</span>
                    </div>
                    <span className="section-tagline">Direction & Beaufort Scale</span>
                  </div>

                  <div className="wind-pressure-grid">
                    <div className="compass-visual-dial" style={{ '--wind-angle': `${weather.current.windDeg || 0}deg` }}>
                      <span className="compass-cardinal-label n">N</span>
                      <span className="compass-cardinal-label s">S</span>
                      <span className="compass-cardinal-label e">E</span>
                      <span className="compass-cardinal-label w">W</span>
                      <Navigation size={26} className="compass-pointer-needle" />
                    </div>

                    <div className="wind-metrics-column">
                      <div className="wind-metric-row">
                        <span className="wind-metric-label">Wind Velocity</span>
                        <span className="wind-metric-value font-numeric">
                          {round(weather.current.windSpeed)} <small>{speedUnit}</small>
                        </span>
                        <span className="wind-metric-sub">{describeBeaufort(weather.current.windSpeed, unit === 'metric')} from {weather.current.windDir} ({weather.current.windDeg}°)</span>
                      </div>
                      <div className="wind-metric-row">
                        <span className="wind-metric-label">Atmospheric Pressure</span>
                        <span className="wind-metric-value font-numeric">
                          {weather.current.pressure} <small>inHg</small>
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Precipitation Outlook 4-Window Timeline */}
                <section className="dashboard-section-card">
                  <div className="section-header-row">
                    <div className="section-title-group">
                      <CloudRain size={16} />
                      <span>Precipitation Timeline</span>
                    </div>
                    <span className="section-tagline">Upcoming Lookahead</span>
                  </div>

                  <div className="precip-windows-grid">
                    {weather.precipWindows.map(p => (
                      <div className="precip-window-box" key={p.label}>
                        <span className="precip-window-pct font-numeric">{p.chance}%</span>
                        <div className="precip-window-bar">
                          <div className="precip-window-bar-fill" style={{ width: `${p.chance}%` }} />
                        </div>
                        <span className="precip-window-label">{p.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="umbrella-advice-banner">
                    <Umbrella size={16} />
                    <span>
                      {weather.precipWindows.some(p => p.chance >= 50)
                        ? 'High precipitation probability anticipated — carry protective rain gear.'
                        : 'Low precipitation risk anticipated across the next 24-hour cycle.'}
                    </span>
                  </div>
                </section>

                {/* Location Map / Radar Card */}
                <section className="dashboard-section-card">
                  <div className="section-header-row">
                    <div className="section-title-group">
                      <MapPin size={16} />
                      <span>Radar & Location</span>
                    </div>
                    <button
                      className="map-expand-btn"
                      onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${activeCity?.lat}&mlon=${activeCity?.lon}#map=12/${activeCity?.lat}/${activeCity?.lon}`, '_blank')}
                      aria-label="Expand map"
                    >
                      <Maximize2 size={13} />
                      <span>Open Fullscreen</span>
                    </button>
                  </div>

                  <div className="radar-map-wrapper">
                    <iframe title="Location map" src={mapEmbedSrc} loading="lazy" />
                    <div className="map-coordinates-badge font-numeric">
                      {weather.lat.toFixed(3)}°N, {weather.lon.toFixed(3)}°E
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </>
        ) : null}
      </main>

      {/* Sidebar Drawer */}
      <SidebarDrawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        cities={cities}
        activeId={activeId}
        onSelect={selectCity}
        onRemove={removeCity}
        onOpenSearch={() => { setSidebarOpen(false); setSearchOpen(true); }}
        onNav={(id) => { setSidebarOpen(false); setModal(id); }}
      />

      {/* City Search Modal */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} onPick={addCity} />}

      {/* Settings Modal */}
      {modal === 'settings' && (
        <Modal title="Dashboard Settings" subtitle="Configure unit systems, data sync intervals, and sensors." onClose={() => setModal(null)}>
          <div className="settings-menu-group">
            <button className="settings-option-btn" onClick={() => setUnit(u => u === 'imperial' ? 'metric' : 'imperial')}>
              <div className="settings-option-left">
                <Thermometer size={18} />
                <div>
                  <b>Measurement Unit</b>
                  <small>Toggle temperature (°F/°C) & wind velocity (mph / km/h)</small>
                </div>
              </div>
              <span className="settings-pill-value">{unit === 'imperial' ? 'IMPERIAL (°F)' : 'METRIC (°C)'}</span>
            </button>

            <button
              className="settings-option-btn"
              onClick={() => {
                if (activeCity) loadCity(activeCity);
                notify('Synchronized', 'Fetched the latest atmospheric telemetry.');
              }}
            >
              <div className="settings-option-left">
                <RefreshCw size={18} />
                <div>
                  <b>Force Cloud Sync</b>
                  <small>Re-query Open-Meteo numerical prediction models</small>
                </div>
              </div>
              <span className="settings-pill-value">SYNC NOW</span>
            </button>

            <button className="settings-option-btn" onClick={useMyLocation}>
              <div className="settings-option-left">
                <LocateFixed size={18} />
                <div>
                  <b>Locate My Device</b>
                  <small>Auto-detect GPS coordinates for local telemetry</small>
                </div>
              </div>
              <span className="settings-pill-value">GPS LOCATE</span>
            </button>
          </div>
        </Modal>
      )}

      {/* Alerts Modal */}
      {modal === 'notifications' && (
        <Modal
          title="Atmospheric Alerts"
          subtitle="Real-time notifications and weather event logs."
          onClose={() => { setModal(null); setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }}
        >
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
              <Bell size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
              <h4 style={{ color: '#fff', fontSize: '15px' }}>No Active Meteorological Alerts</h4>
              <p style={{ fontSize: '12.5px', marginTop: '4px' }}>Atmospheric conditions remain stable.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ display: 'flex', gap: '12px', padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--glass-card)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', marginTop: '6px' }} />
                  <div>
                    <b style={{ color: '#fff', fontSize: '13.5px' }}>{n.title}</b>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', margin: '2px 0 4px' }}>{n.text}</p>
                    <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{new Date(n.time).toLocaleTimeString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Help Modal */}
      {modal === 'help' && (
        <Modal title="AeroCast Intelligence Guide" subtitle="Learn how to leverage real-time telemetry." onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '14px', background: 'var(--glass-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-subtle)' }}>
              <Bot size={18} color="var(--accent-cyan)" style={{ marginBottom: '6px' }} />
              <b style={{ color: '#fff', fontSize: '13.5px', display: 'block' }}>WeatherAI Copilot</b>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>Natural language meteorological reasoning with Gemini fallback.</p>
            </div>
            <div style={{ padding: '14px', background: 'var(--glass-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-subtle)' }}>
              <Search size={18} color="var(--accent-cyan)" style={{ marginBottom: '6px' }} />
              <b style={{ color: '#fff', fontSize: '13.5px', display: 'block' }}>Global Geocoding</b>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>Search millions of locations and track active cities in the top fleet bar.</p>
            </div>
            <div style={{ padding: '14px', background: 'var(--glass-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-subtle)' }}>
              <Compass size={18} color="var(--accent-cyan)" style={{ marginBottom: '6px' }} />
              <b style={{ color: '#fff', fontSize: '13.5px', display: 'block' }}>Dynamic Telemetry</b>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>Beaufort wind scale, pressure trend, and astronomical arc.</p>
            </div>
            <div style={{ padding: '14px', background: 'var(--glass-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-subtle)' }}>
              <Umbrella size={18} color="var(--accent-cyan)" style={{ marginBottom: '6px' }} />
              <b style={{ color: '#fff', fontSize: '13.5px', display: 'block' }}>Rain Prediction</b>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>4-window aggregated outlook with umbrella recommendations.</p>
            </div>
          </div>
        </Modal>
      )}

      {/* User Profile Modal */}
      {modal === 'profile' && (
        <Modal title="Telemetry Account" subtitle="AeroCast Workstation Profile." onClose={() => setModal(null)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--glass-card)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '20px' }}>
              AC
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '16px' }}>AeroCast Professional</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>Fleet Weather Intelligence & AI Analysis</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Floating WeatherAI Copilot Drawer */}
      <CopilotWidget
        open={chatOpen}
        setOpen={setChatOpen}
        messages={messages}
        input={chatInput}
        setInput={setChatInput}
        onSend={sendChat}
        loading={chatLoading}
      />

      {/* Toast Notification */}
      <Toast toast={toast} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
