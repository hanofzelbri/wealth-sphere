// This file is auto-generated by @hey-api/openapi-ts

import { createClient, createConfig, type Options } from '@hey-api/client-axios';
import type { InvestmentsControllerGetAllInvestmentsResponse, InvestmentsControllerCreateInvestmentData, InvestmentsControllerCreateInvestmentResponse, InvestmentsControllerDeleteInvestmentData, InvestmentsControllerGetInvestmentByIdData, InvestmentsControllerGetInvestmentByIdResponse, InvestmentsControllerGetInvestmentBySymbolData, InvestmentsControllerGetInvestmentBySymbolResponse, CoingeckoControllerGetAllMarketChartDataData, CoingeckoControllerGetAllMarketChartDataResponse, CoingeckoControllerGetMarketChartDataData, CoingeckoControllerGetMarketChartDataResponse, CoingeckoControllerUpdateCoinPricesResponse, CoingeckoControllerUpdateMarketChartDataResponse, TransactionsControllerGetAllTransactionsResponse, TransactionsControllerCreateTransactionData, TransactionsControllerCreateTransactionResponse, TransactionsControllerGetAllTransactionsForInvestmentIdData, TransactionsControllerGetAllTransactionsForInvestmentIdResponse, TransactionsControllerDeleteTransactionData, TransactionsControllerGetTransactionByIdData, TransactionsControllerGetTransactionByIdResponse, TransactionsControllerUpdateTransactionData, TransactionsControllerUpdateTransactionResponse, StakingsControllerGetAllStakingsResponse, StakingsControllerCreateStakingData, StakingsControllerCreateStakingResponse, StakingsControllerDeleteStakingData, StakingsControllerGetStakingByIdData, StakingsControllerGetStakingByIdResponse, StakingsControllerUpdateStakingData, StakingsControllerUpdateStakingResponse, StakingsControllerGetAllStakingPercentagesResponse, StorageLocationsControllerFindAllResponse, StorageLocationsControllerCreateData, StorageLocationsControllerCreateResponse, StorageLocationsControllerDeleteData, StorageLocationsControllerFindOneData, StorageLocationsControllerFindOneResponse, StorageLocationsControllerUpdateData, StorageLocationsControllerUpdateResponse, StorageControllerFindAllResponse, StorageControllerCreateData, StorageControllerCreateResponse, StorageControllerDeleteData, StorageControllerFindOneData, StorageControllerFindOneResponse, StorageControllerUpdateData, StorageControllerGetAllocationByLocationResponse, PortfolioControllerGetPortfolioHistoryData, PortfolioControllerGetPortfolioHistoryResponse, BlockchainCenterControllerGetAltcoinSeasonIndexResponse } from './types.gen';
import { investmentsControllerGetAllInvestmentsResponseTransformer, investmentsControllerCreateInvestmentResponseTransformer, investmentsControllerGetInvestmentByIdResponseTransformer, investmentsControllerGetInvestmentBySymbolResponseTransformer, coingeckoControllerGetAllMarketChartDataResponseTransformer, coingeckoControllerGetMarketChartDataResponseTransformer, transactionsControllerGetAllTransactionsResponseTransformer, transactionsControllerCreateTransactionResponseTransformer, transactionsControllerGetAllTransactionsForInvestmentIdResponseTransformer, transactionsControllerGetTransactionByIdResponseTransformer, transactionsControllerUpdateTransactionResponseTransformer, stakingsControllerGetAllStakingsResponseTransformer, stakingsControllerCreateStakingResponseTransformer, stakingsControllerGetStakingByIdResponseTransformer, stakingsControllerUpdateStakingResponseTransformer, storageControllerFindAllResponseTransformer, storageControllerCreateResponseTransformer, storageControllerFindOneResponseTransformer } from './transformers.gen';

export const client = createClient(createConfig());

export const appControllerGetHello = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<unknown, unknown, ThrowOnError>({
        ...options,
        url: '/'
    });
};

export const investmentsControllerGetAllInvestments = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<InvestmentsControllerGetAllInvestmentsResponse, unknown, ThrowOnError>({
        ...options,
        url: '/investments',
        responseTransformer: investmentsControllerGetAllInvestmentsResponseTransformer
    });
};

export const investmentsControllerCreateInvestment = <ThrowOnError extends boolean = false>(options: Options<InvestmentsControllerCreateInvestmentData, ThrowOnError>) => {
    return (options?.client ?? client).post<InvestmentsControllerCreateInvestmentResponse, unknown, ThrowOnError>({
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        url: '/investments',
        responseTransformer: investmentsControllerCreateInvestmentResponseTransformer
    });
};

export const investmentsControllerDeleteInvestment = <ThrowOnError extends boolean = false>(options: Options<InvestmentsControllerDeleteInvestmentData, ThrowOnError>) => {
    return (options?.client ?? client).delete<unknown, unknown, ThrowOnError>({
        ...options,
        url: '/investments/{id}'
    });
};

export const investmentsControllerGetInvestmentById = <ThrowOnError extends boolean = false>(options: Options<InvestmentsControllerGetInvestmentByIdData, ThrowOnError>) => {
    return (options?.client ?? client).get<InvestmentsControllerGetInvestmentByIdResponse, unknown, ThrowOnError>({
        ...options,
        url: '/investments/{id}',
        responseTransformer: investmentsControllerGetInvestmentByIdResponseTransformer
    });
};

export const investmentsControllerGetInvestmentBySymbol = <ThrowOnError extends boolean = false>(options: Options<InvestmentsControllerGetInvestmentBySymbolData, ThrowOnError>) => {
    return (options?.client ?? client).get<InvestmentsControllerGetInvestmentBySymbolResponse, unknown, ThrowOnError>({
        ...options,
        url: '/investments/symbol/{symbol}',
        responseTransformer: investmentsControllerGetInvestmentBySymbolResponseTransformer
    });
};

export const coingeckoControllerGetAllMarketChartData = <ThrowOnError extends boolean = false>(options: Options<CoingeckoControllerGetAllMarketChartDataData, ThrowOnError>) => {
    return (options?.client ?? client).get<CoingeckoControllerGetAllMarketChartDataResponse, unknown, ThrowOnError>({
        ...options,
        url: '/coingecko/market-chart',
        responseTransformer: coingeckoControllerGetAllMarketChartDataResponseTransformer
    });
};

export const coingeckoControllerGetMarketChartData = <ThrowOnError extends boolean = false>(options: Options<CoingeckoControllerGetMarketChartDataData, ThrowOnError>) => {
    return (options?.client ?? client).get<CoingeckoControllerGetMarketChartDataResponse, unknown, ThrowOnError>({
        ...options,
        url: '/coingecko/market-chart/{coinId}',
        responseTransformer: coingeckoControllerGetMarketChartDataResponseTransformer
    });
};

export const coingeckoControllerUpdateCoinPrices = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).put<CoingeckoControllerUpdateCoinPricesResponse, unknown, ThrowOnError>({
        ...options,
        url: '/coingecko/update-coin-prices'
    });
};

export const coingeckoControllerUpdateMarketChartData = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).put<CoingeckoControllerUpdateMarketChartDataResponse, unknown, ThrowOnError>({
        ...options,
        url: '/coingecko/update-market-chart-data'
    });
};

export const transactionsControllerGetAllTransactions = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<TransactionsControllerGetAllTransactionsResponse, unknown, ThrowOnError>({
        ...options,
        url: '/transactions',
        responseTransformer: transactionsControllerGetAllTransactionsResponseTransformer
    });
};

export const transactionsControllerCreateTransaction = <ThrowOnError extends boolean = false>(options: Options<TransactionsControllerCreateTransactionData, ThrowOnError>) => {
    return (options?.client ?? client).post<TransactionsControllerCreateTransactionResponse, unknown, ThrowOnError>({
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        url: '/transactions',
        responseTransformer: transactionsControllerCreateTransactionResponseTransformer
    });
};

export const transactionsControllerGetAllTransactionsForInvestmentId = <ThrowOnError extends boolean = false>(options: Options<TransactionsControllerGetAllTransactionsForInvestmentIdData, ThrowOnError>) => {
    return (options?.client ?? client).get<TransactionsControllerGetAllTransactionsForInvestmentIdResponse, unknown, ThrowOnError>({
        ...options,
        url: '/transactions/investment/{id}',
        responseTransformer: transactionsControllerGetAllTransactionsForInvestmentIdResponseTransformer
    });
};

export const transactionsControllerDeleteTransaction = <ThrowOnError extends boolean = false>(options: Options<TransactionsControllerDeleteTransactionData, ThrowOnError>) => {
    return (options?.client ?? client).delete<unknown, unknown, ThrowOnError>({
        ...options,
        url: '/transactions/{id}'
    });
};

export const transactionsControllerGetTransactionById = <ThrowOnError extends boolean = false>(options: Options<TransactionsControllerGetTransactionByIdData, ThrowOnError>) => {
    return (options?.client ?? client).get<TransactionsControllerGetTransactionByIdResponse, unknown, ThrowOnError>({
        ...options,
        url: '/transactions/{id}',
        responseTransformer: transactionsControllerGetTransactionByIdResponseTransformer
    });
};

export const transactionsControllerUpdateTransaction = <ThrowOnError extends boolean = false>(options: Options<TransactionsControllerUpdateTransactionData, ThrowOnError>) => {
    return (options?.client ?? client).put<TransactionsControllerUpdateTransactionResponse, unknown, ThrowOnError>({
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        url: '/transactions/{id}',
        responseTransformer: transactionsControllerUpdateTransactionResponseTransformer
    });
};

export const stakingsControllerGetAllStakings = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<StakingsControllerGetAllStakingsResponse, unknown, ThrowOnError>({
        ...options,
        url: '/stakings',
        responseTransformer: stakingsControllerGetAllStakingsResponseTransformer
    });
};

export const stakingsControllerCreateStaking = <ThrowOnError extends boolean = false>(options: Options<StakingsControllerCreateStakingData, ThrowOnError>) => {
    return (options?.client ?? client).post<StakingsControllerCreateStakingResponse, unknown, ThrowOnError>({
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        url: '/stakings',
        responseTransformer: stakingsControllerCreateStakingResponseTransformer
    });
};

export const stakingsControllerDeleteStaking = <ThrowOnError extends boolean = false>(options: Options<StakingsControllerDeleteStakingData, ThrowOnError>) => {
    return (options?.client ?? client).delete<unknown, unknown, ThrowOnError>({
        ...options,
        url: '/stakings/{id}'
    });
};

export const stakingsControllerGetStakingById = <ThrowOnError extends boolean = false>(options: Options<StakingsControllerGetStakingByIdData, ThrowOnError>) => {
    return (options?.client ?? client).get<StakingsControllerGetStakingByIdResponse, unknown, ThrowOnError>({
        ...options,
        url: '/stakings/{id}',
        responseTransformer: stakingsControllerGetStakingByIdResponseTransformer
    });
};

export const stakingsControllerUpdateStaking = <ThrowOnError extends boolean = false>(options: Options<StakingsControllerUpdateStakingData, ThrowOnError>) => {
    return (options?.client ?? client).put<StakingsControllerUpdateStakingResponse, unknown, ThrowOnError>({
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        url: '/stakings/{id}',
        responseTransformer: stakingsControllerUpdateStakingResponseTransformer
    });
};

export const stakingsControllerGetAllStakingPercentages = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<StakingsControllerGetAllStakingPercentagesResponse, unknown, ThrowOnError>({
        ...options,
        url: '/stakings/percentages'
    });
};

export const storageLocationsControllerFindAll = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<StorageLocationsControllerFindAllResponse, unknown, ThrowOnError>({
        ...options,
        url: '/storage-locations'
    });
};

export const storageLocationsControllerCreate = <ThrowOnError extends boolean = false>(options: Options<StorageLocationsControllerCreateData, ThrowOnError>) => {
    return (options?.client ?? client).post<StorageLocationsControllerCreateResponse, unknown, ThrowOnError>({
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        url: '/storage-locations'
    });
};

export const storageLocationsControllerDelete = <ThrowOnError extends boolean = false>(options: Options<StorageLocationsControllerDeleteData, ThrowOnError>) => {
    return (options?.client ?? client).delete<unknown, unknown, ThrowOnError>({
        ...options,
        url: '/storage-locations/{id}'
    });
};

export const storageLocationsControllerFindOne = <ThrowOnError extends boolean = false>(options: Options<StorageLocationsControllerFindOneData, ThrowOnError>) => {
    return (options?.client ?? client).get<StorageLocationsControllerFindOneResponse, unknown, ThrowOnError>({
        ...options,
        url: '/storage-locations/{id}'
    });
};

export const storageLocationsControllerUpdate = <ThrowOnError extends boolean = false>(options: Options<StorageLocationsControllerUpdateData, ThrowOnError>) => {
    return (options?.client ?? client).put<StorageLocationsControllerUpdateResponse, unknown, ThrowOnError>({
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        url: '/storage-locations/{id}'
    });
};

export const storageControllerFindAll = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<StorageControllerFindAllResponse, unknown, ThrowOnError>({
        ...options,
        url: '/storages',
        responseTransformer: storageControllerFindAllResponseTransformer
    });
};

export const storageControllerCreate = <ThrowOnError extends boolean = false>(options: Options<StorageControllerCreateData, ThrowOnError>) => {
    return (options?.client ?? client).post<StorageControllerCreateResponse, unknown, ThrowOnError>({
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        url: '/storages',
        responseTransformer: storageControllerCreateResponseTransformer
    });
};

export const storageControllerDelete = <ThrowOnError extends boolean = false>(options: Options<StorageControllerDeleteData, ThrowOnError>) => {
    return (options?.client ?? client).delete<unknown, unknown, ThrowOnError>({
        ...options,
        url: '/storages/{id}'
    });
};

export const storageControllerFindOne = <ThrowOnError extends boolean = false>(options: Options<StorageControllerFindOneData, ThrowOnError>) => {
    return (options?.client ?? client).get<StorageControllerFindOneResponse, unknown, ThrowOnError>({
        ...options,
        url: '/storages/{id}',
        responseTransformer: storageControllerFindOneResponseTransformer
    });
};

export const storageControllerUpdate = <ThrowOnError extends boolean = false>(options: Options<StorageControllerUpdateData, ThrowOnError>) => {
    return (options?.client ?? client).put<unknown, unknown, ThrowOnError>({
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        url: '/storages/{id}'
    });
};

export const storageControllerGetAllocationByLocation = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<StorageControllerGetAllocationByLocationResponse, unknown, ThrowOnError>({
        ...options,
        url: '/storages/allocation'
    });
};

export const portfolioControllerGetPortfolioHistory = <ThrowOnError extends boolean = false>(options: Options<PortfolioControllerGetPortfolioHistoryData, ThrowOnError>) => {
    return (options?.client ?? client).get<PortfolioControllerGetPortfolioHistoryResponse, unknown, ThrowOnError>({
        ...options,
        url: '/portfolio/portfolio-history'
    });
};

/**
 * Get Altcoin Season Index
 */
export const blockchainCenterControllerGetAltcoinSeasonIndex = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<BlockchainCenterControllerGetAltcoinSeasonIndexResponse, unknown, ThrowOnError>({
        ...options,
        url: '/blockchain-center/altcoin-season'
    });
};