import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PortfolioDashboard } from "./components/dashboard/PortfolioDashboard";
import { Header } from "./components/header/Header";
import { InvestmentDetails } from "./components/details/InvestmentDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PageNotFound } from "./components/utils/PageNotFound";
import { client } from "./api-client/services.gen";
import { setupAxiosInstance } from "./lib/axios";
import { AxiosStatic } from "axios";

const publicApiURL = process.env.VITE_PUBLIC_API_URL;
if (!publicApiURL) {
  throw new Error("VITE_PUBLIC_API_URL must be defined");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
    },
  },
});

client.setConfig({
  baseURL: publicApiURL,
  axios: setupAxiosInstance(publicApiURL, queryClient) as AxiosStatic,
});

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
