import { useEffect, useState } from 'react';
import { carService } from '../services/carService';

export const useCars = ({ categoryId = '', page = 1, limit = 6 } = {}) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await carService.getAll({ categoryId, page, limit });
        setCars((prev) => (page === 1 ? data : [...prev, ...data]));
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [categoryId, page, limit]);

  return { cars, loading, error };
};