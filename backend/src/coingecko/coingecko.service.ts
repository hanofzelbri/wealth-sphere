import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CoinPrice, CoinMarketChart } from './interfaces';
import { BaseApiService } from '../common/base-api.service';

@Injectable()
export class CoingeckoService extends BaseApiService {
  async pingAPI(): Promise<{ gecko_says: string }> {
    return this.fetchWithRetry<{ gecko_says: string }>('/ping');
  }

  async getCoinPrices(
    coinIds: string[],
    currency = 'usd',
  ): Promise<CoinPrice[]> {
    if (!coinIds || coinIds.length === 0) {
      throw new HttpException('Keine Coins angegeben', HttpStatus.BAD_REQUEST);
    }

    const ret = this.fetchWithRetry<CoinPrice[]>(
      `/coins/markets?vs_currency=${currency}&ids=${coinIds.join(',')}&order=market_cap_desc&sparkline=false`,
    );
    console.log(ret);
    return ret;
  }

  async getCoinMarketChart(
    coinId: string,
    currency = 'usd',
    days = 7,
  ): Promise<CoinMarketChart> {
    return this.fetchWithRetry<CoinMarketChart>(
      `/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
    );
  }
}
