import { useState, useEffect } from 'react';
import { getInvestmentById } from '../services/portfolio.service';

export const useInvestment = (id: string) => {
  const [investment, setInvestment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const data = await getInvestmentById(id);
        setInvestment(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestment();
  }, [id]);

  return { investment, isLoading, error };
};
