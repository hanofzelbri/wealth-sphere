import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PortfolioDashboard from "./components/PortfolioDashboard"
import InvestmentDetails from './components/InvestmentDetails';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Wealth Sphere</h1>
          <Routes>
            <Route path="/" element={<PortfolioDashboard />} />
            <Route path="/investment/:symbol" element={<InvestmentDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
