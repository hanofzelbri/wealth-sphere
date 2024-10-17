import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { InvestmentDetails } from './components/InvestmentDetails';
import { EditInvestment } from './components/EditInvestment';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<PortfolioDashboard />} />
          <Route path="/investment/:symbol" element={<InvestmentDetails />} />
          <Route path="/edit-investment/:symbol" element={<EditInvestment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
