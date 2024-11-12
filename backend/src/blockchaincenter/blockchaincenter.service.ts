import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class AltcoinSeasonService {
  private readonly baseUrl =
    'https://www.blockchaincenter.net/en/altcoin-season-index/';

  async getAltcoinSeasonIndex(): Promise<{
    altcoinSeason: number;
    month: number;
    year: number;
  }> {
    try {
      const response = await axios.get(this.baseUrl);
      const html = response.data;
      const $ = cheerio.load(html);

      // Extract data from the relevant buttons in the `#altseasontab`
      const altcoinSeason = parseInt(
        $('#altseasontab button.nav-link.timeselect.active b')
          .text()
          .replace(/[()]/g, ''), // Removes parentheses
        10,
      );

      const month = parseInt(
        $('#altseasontab button.nav-link.timeselect[data-t="30"] b')
          .text()
          .replace(/[()]/g, ''),
        10,
      );

      const year = parseInt(
        $('#altseasontab button.nav-link.timeselect[data-t="365"] b')
          .text()
          .replace(/[()]/g, ''),
        10,
      );

      return { altcoinSeason, month, year };
    } catch (error) {
      throw new Error(`Failed to fetch Altcoin Season Index: ${error.message}`);
    }
  }
}
