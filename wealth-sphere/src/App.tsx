import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { InvestmentDetails } from './components/InvestmentDetails';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PortfolioDashboard />} />
          <Route path="/investment/:id" element={<InvestmentDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
