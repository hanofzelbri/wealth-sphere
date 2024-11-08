import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ConfigService } from '../config/config.service';

@Injectable()
export class BaseApiService {
  protected readonly axiosInstance: AxiosInstance;
  protected readonly apiKey: string;
  protected readonly baseUrl: string;

  constructor(protected readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.coingeckoApiUrl,
      headers: {
        'x-cg-demo-api-key': this.configService.coingeckoApiKey,
      },
    });
  }

  protected async fetchWithRetry<T>(
    url: string,
    config?: AxiosRequestConfig,
    retries = 3,
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      if (retries > 0 && error.response?.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.fetchWithRetry(url, config, retries - 1);
      }
      throw new HttpException(
        error.response?.data?.error || 'API request failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
