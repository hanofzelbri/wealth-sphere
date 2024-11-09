import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { appConfig } from './configuration';

import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

@Injectable()
export class ConfigService {
  private configService: NestConfigService<ReturnType<typeof appConfig>, true>;
  constructor() {
    const envFilePath = '.env.local';
    dotenv.config({
      path: existsSync(envFilePath) ? envFilePath : undefined,
      override: true,
    });

    this.configService = new NestConfigService(appConfig());
    this.validateConfig();
  }

  get databaseUrl(): string {
    return this.configService.get('database.url', { infer: true });
  }

  get databaseDirectUrl(): string {
    return this.configService.get('database.directUrl', { infer: true });
  }

  get supabaseJwtSecret(): string {
    return this.configService.get('supabase.jwtSecret', { infer: true });
  }

  get coingeckoApiKey(): string {
    return this.configService.get('coingecko.apiKey', { infer: true });
  }

  get coingeckoApiUrl(): string {
    return this.configService.get('coingecko.apiUrl', { infer: true });
  }

  validateConfig(): void {
    const configMap = {
      DATABASE_URL: this.databaseUrl,
      DATABASE_DIRECT_URL: this.databaseDirectUrl,
      SUPABASE_JWT_SECRET: this.supabaseJwtSecret,
      COINGECKO_API_KEY: this.coingeckoApiKey,
      COINGECKO_API_URL: this.coingeckoApiUrl,
    };
    const missingVars = Object.entries(configMap)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`,
      );
    }
  }
}
