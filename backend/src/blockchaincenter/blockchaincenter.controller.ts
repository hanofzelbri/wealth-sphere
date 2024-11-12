import { Controller, Get } from '@nestjs/common';
import { AltcoinSeasonService } from './blockchaincenter.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('blockchain-center')
@Controller('blockchain-center')
export class BlockchainCenterController {
  constructor(private readonly altcoinSeasonService: AltcoinSeasonService) {}

  @Get('altcoin-season')
  @ApiOperation({ summary: 'Get Altcoin Season Index' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current Altcoin Season Index data',
    schema: {
      type: 'object',
      properties: {
        altcoinSeason: { type: 'number' },
        month: { type: 'number' },
        year: { type: 'number' },
      },
    },
  })
  async getAltcoinSeasonIndex() {
    return await this.altcoinSeasonService.getAltcoinSeasonIndex();
  }
}
