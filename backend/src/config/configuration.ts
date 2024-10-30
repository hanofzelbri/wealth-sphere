export const appConfig = () => ({
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
  supabase: {
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
  },
  coingecko: {
    apiKey: process.env.COINGECKO_API_KEY,
    apiUrl: process.env.COINGECKO_API_URL,
  },
});

export type AppConfig = ReturnType<typeof appConfig>;
