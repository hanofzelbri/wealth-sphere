import { client } from "@/api-client/services.gen";
import { setupAxiosInstance } from "@/lib/axios";
import { AxiosStatic } from "axios";

export const setupApiClient = () => {
  const publicApiURL = process.env.VITE_PUBLIC_API_URL;
  if (!publicApiURL) {
    throw new Error("VITE_PUBLIC_API_URL must be defined");
  }

  client.setConfig({
    baseURL: publicApiURL,
    axios: setupAxiosInstance(publicApiURL) as AxiosStatic,
  });

  client.instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};
