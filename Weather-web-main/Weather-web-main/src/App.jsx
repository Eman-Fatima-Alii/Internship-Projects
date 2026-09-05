import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react';

const API_BASE = 'http://localhost:5173/api';

function App() {
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('London');
  const [unit, setUnit] = useState('metric');

  useEffect(() => {
    fetchWeather();
  }, [city, unit]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/weather?city=${city}&unit=${unit}`);
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!message.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, weather, conversation: [] })
      });
      const data = await res.json();
      setResponse(data.reply || 'No response');
      setMessage('');
    } catch (error) {
      console.error('AI request error:', error);
      setResponse('Error: Unable to get response');
    } finally {
      setLoading(false);
    }
  };

  if (!weather) return <div className="spinner" style={{ margin: '50px auto' }} />;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="gradient-text">🌍 AeroCast — Weather Intelligence Hub</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
        {/* Weather Display */}
        <div className="card">
          <h2>{weather.city}</h2>
          <p style={{ fontSize: '48px', marginTop: '10px' }}>{Math.round(weather.current.temperature)}°{unit === 'metric' ? 'C' : 'F'}</p>
          <p style={{ color: 'var(--text-secondary)' }}>{weather.current.condition}</p>
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div><Wind size={20} /> {Math.round(weather.current.windSpeed)} {unit === 'metric' ? 'km/h' : 'mph'}</div>
            <div><Droplets size={20} /> {Math.round(weather.current.humidity)}%</div>
            <div><Eye size={20} /> {weather.current.visibility || 'N/A'}</div>
            <div><Gauge size={20} /> {weather.current.pressure || 'N/A'} hPa</div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>Weather AI Assistant</h3>
          <div style={{ flex: 1, overflowY: 'auto', marginTop: '10px', marginBottom: '10px', minHeight: '200px' }}>
            {response && <p style={{ fontSize: '14px' }}>{response}</p>}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Ask about weather..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              style={{ flex: 1 }}
            />
            <button className="button button-primary" onClick={handleAsk} disabled={loading}>
              {loading ? 'Asking...' : 'Ask'}
            </button>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="card">
        <h3>10-Day Forecast</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '15px' }}>
          {(weather.daily || []).slice(0, 10).map((day, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '10px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{day.label}</p>
              <p style={{ fontSize: '18px', marginTop: '5px' }}>{day.condition}</p>
              <p style={{ marginTop: '5px' }}>{Math.round(day.high)}° / {Math.round(day.low)}°</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>🌧️ {day.precipChance}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;