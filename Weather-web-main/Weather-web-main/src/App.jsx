import React, { useEffect, useMemo, useState } from 'react';
import {
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Search,
  MapPin,
  Star,
  Navigation,
  Settings,
  HelpCircle,
  User,
  Bell,
  Menu,
  X,
  Send,
  Sunrise,
  Sunset,
  Thermometer,
  Umbrella,
  RefreshCw,
  ChevronDown,
  MessageCircle,
  Map as MapIcon,
  CalendarDays,
  Clock,
  LocateFixed
} from 'lucide-react';

const API_BASE = '/api';

function getWeatherIcon(condition = '', size = 28) {
  const text = condition.toLowerCase();

  if (
    text.includes('thunder') ||
    text.includes('storm')
  ) {
    return <CloudRain size={size} />;
  }

  if (
    text.includes('rain') ||
    text.includes('drizzle') ||
    text.includes('shower')
  ) {
    return <CloudRain size={size} />;
  }

  if (
    text.includes('partly') ||
    text.includes('mainly')
  ) {
    return <CloudSun size={size} />;
  }

  if (
    text.includes('cloud') ||
    text.includes('overcast') ||
    text.includes('fog') ||
    text.includes('mist')
  ) {
    return <Cloud size={size} />;
  }

  if (
    text.includes('snow') ||
    text.includes('ice')
  ) {
    return <CloudSnowIcon size={size} />;
  }

  return <Sun size={size} />;
}

function CloudSnowIcon({ size }) {
  return <Cloud size={size} />;
}

function formatHour(time) {
  if (!time) return '--';

  try {
    return new Date(time).toLocaleTimeString([], {
      hour: 'numeric'
    });
  } catch {
    return '--';
  }
}

function formatDate(date) {
  if (!date) return '';

  try {
    return new Date(`${date}T12:00:00`).toLocaleDateString([], {
      weekday: 'short'
    });
  } catch {
    return '';
  }
}

function formatFullDate(date) {
  if (!date) return '';

  try {
    return new Date(`${date}T12:00:00`).toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return '';
  }
}

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('London');
  const [search, setSearch] = useState('');
  const [unit, setUnit] = useState('metric');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [savedCities, setSavedCities] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('aerocast-cities')
      ) || ['London'];
    } catch {
      return ['London'];
    }
  });

  const [activeTab, setActiveTab] = useState('today');

  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! 👋 I’m WeatherAI. Ask me about rain, temperature, wind, what to wear, or the forecast.'
    }
  ]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'km/h' : 'mph';

  useEffect(() => {
    fetchWeather();
  }, [city, unit]);

  useEffect(() => {
    localStorage.setItem(
      'aerocast-cities',
      JSON.stringify(savedCities)
    );
  }, [savedCities]);

  async function fetchWeather() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${API_BASE}/weather?city=${encodeURIComponent(
          city
        )}&unit=${unit}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'Unable to load weather.'
        );
      }

      setWeather(data);
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          'Unable to load weather data.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();

    const value = search.trim();

    if (!value) return;

    setCity(value);

    if (!savedCities.includes(value)) {
      setSavedCities(prev => [
        value,
        ...prev
      ].slice(0, 8));
    }

    setSearch('');
  }

  function toggleSavedCity() {
    if (!weather?.city) return;

    if (savedCities.includes(weather.city)) {
      setSavedCities(prev =>
        prev.filter(
          item => item !== weather.city
        )
      );
    } else {
      setSavedCities(prev => [
        weather.city,
        ...prev
      ].slice(0, 8));
    }
  }

  function useLocation() {
    if (!navigator.geolocation) {
      setError(
        'Geolocation is not supported by your browser.'
      );
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const { latitude, longitude } =
            position.coords;

          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
          );

          const data = await response.json();

          const location =
            data?.results?.[0];

          if (!location?.name) {
            throw new Error(
              'Could not determine your location.'
            );
          }

          setCity(location.name);

          if (
            !savedCities.includes(location.name)
          ) {
            setSavedCities(prev => [
              location.name,
              ...prev
            ].slice(0, 8));
          }
        } catch (err) {
          setError(
            err?.message ||
              'Unable to determine your location.'
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError(
          'Location permission was denied.'
        );
      }
    );
  }

  async function handleAsk() {
    if (!message.trim() || chatLoading) {
      return;
    }

    const userMessage = message.trim();

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        text: userMessage
      }
    ]);

    setMessage('');
    setChatLoading(true);

    try {
      const conversation =
        messages.map(item => ({
          role: item.role,
          text: item.text
        }));

      const response = await fetch(
        `${API_BASE}/ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            message: userMessage,
            weather,
            conversation
          })
        }
      );

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text:
            data?.reply ||
            'I could not generate a response.'
        }
      ]);
    } catch (err) {
      console.error(err);

      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text:
            'Sorry, I could not connect to the weather assistant.'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  const hourly = useMemo(() => {
    if (!weather?.hourly) return [];

    const now = new Date();

    const times =
      weather.hourly.time || [];

    const startIndex =
      times.findIndex(
        time =>
          new Date(time) >= now
      );

    const index =
      startIndex >= 0
        ? startIndex
        : 0;

    return times
      .slice(index, index + 12)
      .map((time, offset) => {
        const i = index + offset;

        return {
          time,
          temperature:
            weather.hourly.temperature?.[i],
          condition:
            weather.hourly.condition?.[i],
          precipitation:
            weather.hourly.precipChance?.[i],
          wind:
            weather.hourly.windSpeed?.[i]
        };
      });
  }, [weather]);

  const today =
    weather?.daily?.[0];

  const isSaved =
    weather?.city &&
    savedCities.includes(weather.city);

  if (loading && !weather) {
    return (
      <div className="app-loading">
        <div className="loading-logo">
          <CloudSun size={42} />
        </div>

        <div className="loading-spinner" />

        <h2>AeroCast</h2>
        <p>Loading live weather...</p>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="app-loading">
        <div className="error-box">
          <CloudRain size={42} />
          <h2>Weather unavailable</h2>
          <p>{error}</p>

          <button
            className="primary-button"
            onClick={fetchWeather}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="aerocast-app">

      {/* ================= HEADER ================= */}

      <header className="topbar">

        <div className="brand">
          <div className="brand-icon">
            <CloudSun size={24} />
          </div>

          <div>
            <div className="brand-name">
              AeroCast
            </div>

            <div className="brand-subtitle">
              Weather Intelligence
            </div>
          </div>
        </div>

        <form
          className="search-box"
          onSubmit={handleSearch}
        >
          <Search size={18} />

          <input
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
            placeholder="Search any city..."
          />

          <button type="submit">
            Search
          </button>
        </form>

        <div className="header-actions">

          <button
            className="icon-button"
            title="Use current location"
            onClick={useLocation}
          >
            <LocateFixed size={19} />
          </button>

          <button
            className="unit-toggle"
            onClick={() =>
              setUnit(
                unit === 'metric'
                  ? 'imperial'
                  : 'metric'
              )
            }
          >
            {unit === 'metric'
              ? '°C'
              : '°F'}

            <ChevronDown size={14} />
          </button>

          <button
            className="icon-button"
            onClick={() =>
              setModal('notifications')
            }
          >
            <Bell size={19} />
          </button>

          <button
            className="icon-button"
            onClick={() =>
              setModal('profile')
            }
          >
            <User size={19} />
          </button>

          <button
            className="mobile-menu"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div className="mobile-menu-panel">
          <button
            onClick={() =>
              setModal('settings')
            }
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={() =>
              setModal('help')
            }
          >
            <HelpCircle size={18} />
            Help
          </button>

          <button
            onClick={() =>
              setModal('notifications')
            }
          >
            <Bell size={18} />
            Rain Alerts
          </button>
        </div>
      )}

      {/* ================= MAIN ================= */}

      <main className="dashboard">

        {/* CITY HEADER */}

        <section className="location-header">

          <div>
            <div className="location-line">
              <MapPin size={18} />

              <h1>
                {weather?.city}
              </h1>

              <span className="country">
                {weather?.country}
              </span>

              <button
                className={`save-city ${
                  isSaved
                    ? 'saved'
                    : ''
                }`}
                onClick={toggleSavedCity}
                title={
                  isSaved
                    ? 'Remove saved city'
                    : 'Save city'
                }
              >
                <Star
                  size={18}
                  fill={
                    isSaved
                      ? 'currentColor'
                      : 'none'
                  }
                />
              </button>
            </div>

            <p>
              {formatFullDate(
                today?.date
              )}
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchWeather}
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? 'spin'
                  : ''
              }
            />
            Refresh
          </button>

        </section>

        {/* SAVED CITIES */}

        {savedCities.length > 0 && (
          <div className="saved-cities">

            <span>
              Saved:
            </span>

            {savedCities.map(saved => (
              <button
                key={saved}
                className={
                  saved === city
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setCity(saved)
                }
              >
                <Star
                  size={13}
                  fill="currentColor"
                />
                {saved}
              </button>
            ))}

          </div>
        )}

        {/* MOBILE TABS */}

        <div className="mobile-tabs">
          <button
            className={
              activeTab === 'today'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveTab('today')
            }
          >
            <Sun size={17} />
            Today
          </button>

          <button
            className={
              activeTab === 'details'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveTab('details')
            }
          >
            <MapIcon size={17} />
            Map & Details
          </button>
        </div>

        {/* TWO PANEL DASHBOARD */}

        <div className="dashboard-grid">

          {/* ================= TODAY ================= */}

          <section
            className={`today-panel ${
              activeTab !== 'today'
                ? 'mobile-hidden'
                : ''
            }`}
          >

            <div className="panel-heading">
              <div>
                <span className="eyebrow">
                  TODAY
                </span>

                <h2>
                  Current conditions
                </h2>
              </div>

              <div className="live-badge">
                <span />
                LIVE
              </div>
            </div>

            {/* MAIN WEATHER */}

            <div className="hero-weather">

              <div className="hero-icon">
                {getWeatherIcon(
                  weather?.current
                    ?.condition,
                  78
                )}
              </div>

              <div className="hero-temperature">
                <strong>
                  {Math.round(
                    weather?.current
                      ?.temperature ??
                      0
                  )}
                  °
                </strong>

                <span>
                  {temperatureUnit}
                </span>
              </div>

              <div className="hero-condition">
                <h3>
                  {weather?.current
                    ?.condition}
                </h3>

                <p>
                  Feels like{' '}
                  <b>
                    {Math.round(
                      weather?.current
                        ?.feelsLike ??
                        0
                    )}
                    {temperatureUnit}
                  </b>
                </p>
              </div>

            </div>

            {/* QUICK STATS */}

            <div className="quick-stats">

              <WeatherStat
                icon={<Wind />}
                label="Wind"
                value={
                  weather?.current
                    ?.windSpeed
                }
                unit={speedUnit}
                extra={
                  weather?.current
                    ?.windDir
                }
              />

              <WeatherStat
                icon={<Droplets />}
                label="Humidity"
                value={
                  weather?.current
                    ?.humidity
                }
                unit="%"
              />

              <WeatherStat
                icon={<Eye />}
                label="Visibility"
                value={
                  weather?.current
                    ?.visibility
                }
                unit={
                  unit === 'metric'
                    ? 'km'
                    : 'mi'
                }
              />

              <WeatherStat
                icon={<Gauge />}
                label="Pressure"
                value={
                  weather?.current
                    ?.pressure
                }
                unit="hPa"
              />

            </div>

            {/* HOURLY */}

            <div className="section-block">

              <div className="section-title">
                <div>
                  <Clock size={17} />
                  <h3>
                    Hourly forecast
                  </h3>
                </div>

                <span>
                  Next 12 hours
                </span>
              </div>

              <div className="hourly-scroll">

                {hourly.length > 0 ? (
                  hourly.map(
                    (hour, index) => (
                      <div
                        className={`hour-card ${
                          index === 0
                            ? 'current'
                            : ''
                        }`}
                        key={`${hour.time}-${index}`}
                      >
                        <span className="hour-time">
                          {index === 0
                            ? 'Now'
                            : formatHour(
                                hour.time
                              )}
                        </span>

                        <div className="hour-icon">
                          {getWeatherIcon(
                            hour.condition,
                            25
                          )}
                        </div>

                        <strong>
                          {Math.round(
                            hour.temperature ??
                              0
                          )}
                          °
                        </strong>

                        <small>
                          {hour.precipitation ??
                            0}
                          % rain
                        </small>
                      </div>
                    )
                  )
                ) : (
                  <div className="empty-state">
                    Hourly forecast unavailable.
                  </div>
                )}

              </div>
            </div>

            {/* DAILY FORECAST */}

            <div className="section-block">

              <div className="section-title">
                <div>
                  <CalendarDays size={17} />
                  <h3>
                    10-day forecast
                  </h3>
                </div>
              </div>

              <div className="forecast-list">

                {(weather?.daily || [])
                  .slice(0, 10)
                  .map((day, index) => (
                    <div
                      className={`forecast-row ${
                        index === 0
                          ? 'today'
                          : ''
                      }`}
                      key={day.date}
                    >

                      <div className="forecast-day">
                        <strong>
                          {index === 0
                            ? 'Today'
                            : formatDate(
                                day.date
                              )}
                        </strong>

                        <span>
                          {day.label}
                        </span>
                      </div>

                      <div className="forecast-condition">
                        <span className="forecast-icon">
                          {getWeatherIcon(
                            day.condition,
                            25
                          )}
                        </span>

                        <span>
                          {day.condition}
                        </span>
                      </div>

                      <div className="rain-probability">
                        <Droplets size={14} />
                        {day.precipChance ??
                          0}
                        %
                      </div>

                      <div className="forecast-temp">
                        <strong>
                          {Math.round(
                            day.high ?? 0
                          )}
                          °
                        </strong>

                        <span>
                          {Math.round(
                            day.low ?? 0
                          )}
                          °
                        </span>
                      </div>

                    </div>
                  ))}

              </div>
            </div>

          </section>

          {/* ================= MAP & DETAILS ================= */}

          <section
            className={`details-panel ${
              activeTab !== 'details'
                ? 'mobile-hidden'
                : ''
            }`}
          >

            <div className="panel-heading">
              <div>
                <span className="eyebrow">
                  MAP & DETAILS
                </span>

                <h2>
                  Explore conditions
                </h2>
              </div>
            </div>

            {/* MAP */}

            <div className="weather-map">

              <iframe
                title="Weather map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  (weather?.longitude || 0) -
                  0.15
                }%2C${
                  (weather?.latitude || 0) -
                  0.10
                }%2C${
                  (weather?.longitude || 0) +
                  0.15
                }%2C${
                  (weather?.latitude || 0) +
                  0.10
                }&layer=mapnik&marker=${
                  weather?.latitude || 0
                }%2C${
                  weather?.longitude || 0
                }`}
                loading="lazy"
              />

              <div className="map-location">
                <MapPin size={16} />
                {weather?.city}
              </div>

            </div>

            {/* DETAIL GRID */}

            <div className="detail-grid">

              <DetailCard
                icon={<Wind />}
                title="Wind"
                value={
                  weather?.current
                    ?.windSpeed
                }
                unit={speedUnit}
                subtitle={`From ${
                  weather?.current
                    ?.windDir || 'N/A'
                }`}
              />

              <DetailCard
                icon={<Gauge />}
                title="Pressure"
                value={
                  weather?.current
                    ?.pressure
                }
                unit="hPa"
                subtitle={
                  Number(
                    weather?.current
                      ?.pressure
                  ) > 1013
                    ? 'Above normal'
                    : 'Below normal'
                }
              />

              <DetailCard
                icon={<Droplets />}
                title="Humidity"
                value={
                  weather?.current
                    ?.humidity
                }
                unit="%"
                subtitle="Relative humidity"
              />

              <DetailCard
                icon={<Eye />}
                title="Visibility"
                value={
                  weather?.current
                    ?.visibility
                }
                unit={
                  unit === 'metric'
                    ? 'km'
                    : 'mi'
                }
                subtitle="Current visibility"
              />

            </div>

            {/* PRECIPITATION */}

            <div className="precipitation-card">

              <div className="section-title">
                <div>
                  <Umbrella size={17} />
                  <h3>
                    Precipitation
                  </h3>
                </div>
              </div>

              <div className="precip-main">

                <div>
                  <strong>
                    {today?.precipChance ??
                      0}
                    %
                  </strong>

                  <span>
                    chance today
                  </span>
                </div>

                <div className="rain-progress">
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        today?.precipChance ??
                          0
                      )}%`
                    }}
                  />
                </div>

              </div>

              <p>
                {(
                  today?.precipChance ||
                  0
                ) >= 50
                  ? 'Rain is fairly likely today. Consider carrying an umbrella.'
                  : 'Low precipitation probability today. Outdoor plans should be fine.'}
              </p>

            </div>

            {/* SUNRISE SUNSET */}

            <div className="sun-card">

              <div className="sun-item">
                <div className="sun-icon sunrise">
                  <Sunrise size={25} />
                </div>

                <div>
                  <span>
                    Sunrise
                  </span>

                  <strong>
                    {today?.sunrise ||
                      '--'}
                  </strong>
                </div>
              </div>

              <div className="sun-divider" />

              <div className="sun-item">
                <div className="sun-icon sunset">
                  <Sunset size={25} />
                </div>

                <div>
                  <span>
                    Sunset
                  </span>

                  <strong>
                    {today?.sunset ||
                      '--'}
                  </strong>
                </div>
              </div>

            </div>

            {/* UV */}

            <div className="uv-card">

              <div>
                <Sun size={22} />

                <div>
                  <span>
                    UV Index
                  </span>

                  <strong>
                    {weather?.current
                      ?.uv ?? 'N/A'}
                  </strong>
                </div>
              </div>

              <span className="uv-label">
                {getUVDescription(
                  weather?.current?.uv
                )}
              </span>

            </div>

          </section>

        </div>

        {/* FOOTER NAV */}

        <div className="bottom-tools">

          <button
            onClick={() =>
              setModal('notifications')
            }
          >
            <Bell size={17} />
            Rain Alerts
          </button>

          <button
            onClick={() =>
              setModal('settings')
            }
          >
            <Settings size={17} />
            Settings
          </button>

          <button
            onClick={() =>
              setModal('help')
            }
          >
            <HelpCircle size={17} />
            Help
          </button>

        </div>

      </main>

      {/* ================= AI CHAT ================= */}

      {chatOpen && (
        <div className="chat-window">

          <div className="chat-header">

            <div>
              <div className="chat-title">
                <div className="ai-avatar">
                  <CloudSun size={18} />
                </div>

                WeatherAI
              </div>

              <small>
                Live weather assistant
              </small>
            </div>

            <button
              onClick={() =>
                setChatOpen(false)
              }
            >
              <X size={19} />
            </button>

          </div>

          <div className="chat-messages">

            {messages.map(
              (item, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    item.role === 'user'
                      ? 'user'
                      : 'bot'
                  }`}
                >
                  {item.text}
                </div>
              )
            )}

            {chatLoading && (
              <div className="chat-message bot">
                <span className="typing">
                  ● ● ●
                </span>
              </div>
            )}

          </div>

          <div className="chat-input">

            <input
              value={message}
              onChange={e =>
                setMessage(e.target.value)
              }
              onKeyDown={e => {
                if (
                  e.key === 'Enter'
                ) {
                  handleAsk();
                }
              }}
              placeholder="Ask about the weather..."
            />

            <button
              onClick={handleAsk}
              disabled={chatLoading}
            >
              <Send size={17} />
            </button>

          </div>

        </div>
      )}

      <button
        className="chat-fab"
        onClick={() =>
          setChatOpen(!chatOpen)
        }
      >
        {chatOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </button>

      {/* ================= MODALS ================= */}

      {modal && (
        <div
          className="modal-overlay"
          onClick={() =>
            setModal(null)
          }
        >
          <div
            className="modal"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setModal(null)
              }
            >
              <X size={20} />
            </button>

            {modal === 'settings' && (
              <>
                <Settings size={30} />
                <h2>Settings</h2>

                <div className="setting-row">
                  <div>
                    <strong>
                      Temperature unit
                    </strong>
                    <span>
                      Choose how temperatures are displayed.
                    </span>
                  </div>

                  <button
                    className="modal-unit"
                    onClick={() =>
                      setUnit(
                        unit === 'metric'
                          ? 'imperial'
                          : 'metric'
                      )
                    }
                  >
                    {unit === 'metric'
                      ? 'Celsius °C'
                      : 'Fahrenheit °F'}
                  </button>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>
                      Saved cities
                    </strong>
                    <span>
                      {savedCities.length} saved location(s)
                    </span>
                  </div>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      setSavedCities([])
                    }
                  >
                    Clear
                  </button>
                </div>
              </>
            )}

            {modal === 'notifications' && (
              <>
                <Bell size={30} />
                <h2>Rain Alerts</h2>

                <p className="modal-description">
                  Rain alerts are based on the precipitation probability in the live weather forecast.
                </p>

                <div className="alert-preview">
                  <Umbrella size={25} />

                  <div>
                    <strong>
                      Today's rain probability
                    </strong>

                    <span>
                      {today?.precipChance ??
                        0}
                      %
                    </span>
                  </div>
                </div>
              </>
            )}

            {modal === 'help' && (
              <>
                <HelpCircle size={30} />
                <h2>How AeroCast works</h2>

                <p className="modal-description">
                  Search for any city to view live weather conditions, hourly weather, and a 10-day forecast.
                </p>

                <ul className="help-list">
                  <li>
                    Use the search bar to find a city.
                  </li>
                  <li>
                    Save cities with the star button.
                  </li>
                  <li>
                    Use the location button for your current area.
                  </li>
                  <li>
                    Switch between Celsius and Fahrenheit.
                  </li>
                  <li>
                    Ask WeatherAI questions about the forecast.
                  </li>
                </ul>
              </>
            )}

            {modal === 'profile' && (
              <>
                <User size={30} />
                <h2>Profile</h2>

                <div className="profile-card">
                  <div className="profile-avatar">
                    <User size={30} />
                  </div>

                  <strong>
                    AeroCast User
                  </strong>

                  <span>
                    Weather dashboard
                  </span>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

function WeatherStat({
  icon,
  label,
  value,
  unit,
  extra
}) {
  return (
    <div className="weather-stat">

      <div className="stat-icon">
        {React.cloneElement(
          icon,
          { size: 19 }
        )}
      </div>

      <div>
        <span>
          {label}
        </span>

        <strong>
          {value == null
            ? 'N/A'
            : Math.round(value)}
          {value != null && unit
            ? ` ${unit}`
            : ''}
        </strong>

        {extra && (
          <small>
            {extra}
          </small>
        )}
      </div>

    </div>
  );
}

function DetailCard({
  icon,
  title,
  value,
  unit,
  subtitle
}) {
  return (
    <div className="detail-card">

      <div className="detail-card-top">
        {React.cloneElement(
          icon,
          { size: 19 }
        )}

        <span>
          {title}
        </span>
      </div>

      <strong>
        {value == null
          ? 'N/A'
          : Math.round(value)}
        {value != null && unit
          ? ` ${unit}`
          : ''}
      </strong>

      <small>
        {subtitle}
      </small>

    </div>
  );
}

function getUVDescription(uv) {
  if (uv == null) return 'Unavailable';
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very high';
  return 'Extreme';
}

export default App;