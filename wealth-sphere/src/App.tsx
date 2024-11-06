import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PortfolioDashboard } from "./components/dashboard/PortfolioDashboard";
import { Header } from "./components/header/Header";
import { InvestmentDetails } from "./components/details/InvestmentDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PageNotFound } from "./components/utils/PageNotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <div className="container mx-auto p-4">
              <Routes>
                <Route path="/" element={<PortfolioDashboard />} />
                <Route
                  path="/investment/:symbol"
                  element={<InvestmentDetails />}
                />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
