import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdsContext = createContext();

export function AdsProvider({ children }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/ads');
        setAds(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching ads:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <AdsContext.Provider value={{ ads, loading, error }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error('useAds must be used within AdsProvider');
  }
  return context;
}
