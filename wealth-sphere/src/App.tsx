import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { InvestmentDetails } from './components/InvestmentDetails';
import { Header } from './components/Header';
import { userService } from './services/user.service';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const subscription = userService.currentUser.subscribe(user => {
      setIsLoggedIn(!!user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto p-4">
            {isLoggedIn ? (
              <Routes>
                <Route path="/" element={<PortfolioDashboard />} />
                <Route path="/investment/:symbol" element={<InvestmentDetails />} />
              </Routes>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                <p className="mb-4">Please log in to access your portfolio dashboard.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
