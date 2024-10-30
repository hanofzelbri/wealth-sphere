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

    const response = await this.fetchWithRetry<CoinPrice[]>(
      `/coins/markets?vs_currency=${currency}&ids=${coinIds.join(',')}&order=market_cap_desc&sparkline=false`,
    );

    return response.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      ath: coin.ath,
      ath_change_percentage: coin.ath_change_percentage,
      ath_date: coin.ath_date,
      fully_diluted_valuation: coin.fully_diluted_valuation,
    }));
  }

  async getCoinMarketChart(
    coinId: string,
    currency = 'usd',
    days = 7,
  ): Promise<CoinMarketChart> {
    return await this.fetchWithRetry<CoinMarketChart>(
      `/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
    );
  }
}
