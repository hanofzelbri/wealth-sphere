import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { InvestmentDetails } from './components/InvestmentDetails';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<PortfolioDashboard />} />
          <Route path="/investment/:symbol" element={<InvestmentDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
