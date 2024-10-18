import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { InvestmentDetails } from './components/InvestmentDetails';
import { Header } from './components/Header';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<PortfolioDashboard />} />
              <Route path="/investment/:symbol" element={<InvestmentDetails />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
