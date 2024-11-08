// Interface for coin price data
export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  price_change_percentage_24h: number;
  total_volume: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
}

// Interface for market chart data
export interface CoinMarketChart {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][]; // [timestamp, market_cap]
  total_volumes: [number, number][]; // [timestamp, volume]
}
