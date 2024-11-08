import { client } from "@/api-client/services.gen";

client.setConfig({
  baseURL: process.env.VITE_PUBLIC_API_URL,
});

client.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
