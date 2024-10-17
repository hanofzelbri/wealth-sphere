import { useState, useEffect } from 'react';
import { getInvestmentById } from '../services/portfolio.service';
import { Investment } from '../types';

export const useInvestment = (id: string) => {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const data = await getInvestmentById(id);
        setInvestment(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestment();
  }, [id]);

  return { investment, isLoading, error };
};
