import { useState, useEffect } from 'react';

export function useCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/candidates');
      if (!res.ok) throw new Error('Failed to fetch candidates');
      const data = await res.json();
      setCandidates(data.students);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const refresh = () => fetchCandidates();

  return { candidates, isLoading, error, refresh };
}
