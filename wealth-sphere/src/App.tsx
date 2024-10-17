import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { InvestmentDetails } from './components/InvestmentDetails';
import { ErrorPage } from './components/ErrorPage';
import { useInvestment } from './hooks/useInvestment';

const InvestmentRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { investment, isLoading, error } = useInvestment(id ?? '');

  if (isLoading) return <div>Loading...</div>;
  if (error || !investment) return <ErrorPage message="Investment not found" />;

  return <InvestmentDetails />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PortfolioDashboard />} />
          <Route path="/investment/:id" element={<InvestmentRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
