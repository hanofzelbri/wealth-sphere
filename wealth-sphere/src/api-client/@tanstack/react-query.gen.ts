// This file is auto-generated by @hey-api/openapi-ts

import type { Options } from '@hey-api/client-axios';
import { queryOptions, type UseMutationOptions, type DefaultError } from '@tanstack/react-query';
import { client, appControllerGetHello, investmentsControllerGetAllInvestments, investmentsControllerCreateInvestment, investmentsControllerDeleteInvestment, investmentsControllerGetInvestmentById, investmentsControllerGetInvestmentBySymbol, coingeckoControllerGetAllMarketChartData, coingeckoControllerGetMarketChartData, coingeckoControllerUpdateCoinPrices, coingeckoControllerUpdateMarketChartData, transactionsControllerGetAllTransactions, transactionsControllerCreateTransaction, transactionsControllerGetAllTransactionsForInvestmentId, transactionsControllerDeleteTransaction, transactionsControllerGetTransactionById, transactionsControllerUpdateTransaction, stakingsControllerGetAllStakings, stakingsControllerCreateStaking, stakingsControllerDeleteStaking, stakingsControllerGetStakingById, stakingsControllerUpdateStaking, storageLocationsControllerFindAll, storageLocationsControllerCreate, storageLocationsControllerDelete, storageLocationsControllerFindOne, storageLocationsControllerUpdate, storageControllerFindAll, storageControllerCreate, storageControllerDelete, storageControllerFindOne, storageControllerUpdate, portfolioControllerGetPortfolioHistory } from '../services.gen';
import type { InvestmentsControllerCreateInvestmentData, InvestmentsControllerCreateInvestmentResponse, InvestmentsControllerDeleteInvestmentData, InvestmentsControllerGetInvestmentByIdData, InvestmentsControllerGetInvestmentBySymbolData, CoingeckoControllerGetAllMarketChartDataData, CoingeckoControllerGetMarketChartDataData, CoingeckoControllerUpdateCoinPricesResponse, CoingeckoControllerUpdateMarketChartDataResponse, TransactionsControllerCreateTransactionData, TransactionsControllerCreateTransactionResponse, TransactionsControllerGetAllTransactionsForInvestmentIdData, TransactionsControllerDeleteTransactionData, TransactionsControllerGetTransactionByIdData, TransactionsControllerUpdateTransactionData, TransactionsControllerUpdateTransactionResponse, StakingsControllerCreateStakingData, StakingsControllerCreateStakingResponse, StakingsControllerDeleteStakingData, StakingsControllerGetStakingByIdData, StakingsControllerUpdateStakingData, StakingsControllerUpdateStakingResponse, StorageLocationsControllerCreateData, StorageLocationsControllerCreateResponse, StorageLocationsControllerDeleteData, StorageLocationsControllerFindOneData, StorageLocationsControllerUpdateData, StorageLocationsControllerUpdateResponse, StorageControllerCreateData, StorageControllerCreateResponse, StorageControllerDeleteData, StorageControllerFindOneData, StorageControllerUpdateData, StorageControllerUpdateResponse, PortfolioControllerGetPortfolioHistoryData } from '../types.gen';
import type { AxiosError } from 'axios';

type QueryKey<TOptions extends Options> = [
    Pick<TOptions, 'baseURL' | 'body' | 'headers' | 'path' | 'query'> & {
        _id: string;
        _infinite?: boolean;
    }
];

const createQueryKey = <TOptions extends Options>(id: string, options?: TOptions, infinite?: boolean): QueryKey<TOptions>[0] => {
    const params: QueryKey<TOptions>[0] = { _id: id, baseURL: (options?.client ?? client).getConfig().baseURL } as QueryKey<TOptions>[0];
    if (infinite) {
        params._infinite = infinite;
    }
    if (options?.body) {
        params.body = options.body;
    }
    if (options?.headers) {
        params.headers = options.headers;
    }
    if (options?.path) {
        params.path = options.path;
    }
    if (options?.query) {
        params.query = options.query;
    }
    return params;
};

export const appControllerGetHelloQueryKey = (options?: Options) => [
    createQueryKey('appControllerGetHello', options)
];

export const appControllerGetHelloOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await appControllerGetHello({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: appControllerGetHelloQueryKey(options)
    });
};

export const investmentsControllerGetAllInvestmentsQueryKey = (options?: Options) => [
    createQueryKey('investmentsControllerGetAllInvestments', options)
];

export const investmentsControllerGetAllInvestmentsOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await investmentsControllerGetAllInvestments({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: investmentsControllerGetAllInvestmentsQueryKey(options)
    });
};

export const investmentsControllerCreateInvestmentQueryKey = (options: Options<InvestmentsControllerCreateInvestmentData>) => [
    createQueryKey('investmentsControllerCreateInvestment', options)
];

export const investmentsControllerCreateInvestmentOptions = (options: Options<InvestmentsControllerCreateInvestmentData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await investmentsControllerCreateInvestment({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: investmentsControllerCreateInvestmentQueryKey(options)
    });
};

export const investmentsControllerCreateInvestmentMutation = (options?: Partial<Options<InvestmentsControllerCreateInvestmentData>>) => {
    const mutationOptions: UseMutationOptions<InvestmentsControllerCreateInvestmentResponse, AxiosError<DefaultError>, Options<InvestmentsControllerCreateInvestmentData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await investmentsControllerCreateInvestment({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const investmentsControllerDeleteInvestmentMutation = (options?: Partial<Options<InvestmentsControllerDeleteInvestmentData>>) => {
    const mutationOptions: UseMutationOptions<unknown, AxiosError<DefaultError>, Options<InvestmentsControllerDeleteInvestmentData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await investmentsControllerDeleteInvestment({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const investmentsControllerGetInvestmentByIdQueryKey = (options: Options<InvestmentsControllerGetInvestmentByIdData>) => [
    createQueryKey('investmentsControllerGetInvestmentById', options)
];

export const investmentsControllerGetInvestmentByIdOptions = (options: Options<InvestmentsControllerGetInvestmentByIdData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await investmentsControllerGetInvestmentById({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: investmentsControllerGetInvestmentByIdQueryKey(options)
    });
};

export const investmentsControllerGetInvestmentBySymbolQueryKey = (options: Options<InvestmentsControllerGetInvestmentBySymbolData>) => [
    createQueryKey('investmentsControllerGetInvestmentBySymbol', options)
];

export const investmentsControllerGetInvestmentBySymbolOptions = (options: Options<InvestmentsControllerGetInvestmentBySymbolData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await investmentsControllerGetInvestmentBySymbol({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: investmentsControllerGetInvestmentBySymbolQueryKey(options)
    });
};

export const coingeckoControllerGetAllMarketChartDataQueryKey = (options: Options<CoingeckoControllerGetAllMarketChartDataData>) => [
    createQueryKey('coingeckoControllerGetAllMarketChartData', options)
];

export const coingeckoControllerGetAllMarketChartDataOptions = (options: Options<CoingeckoControllerGetAllMarketChartDataData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await coingeckoControllerGetAllMarketChartData({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: coingeckoControllerGetAllMarketChartDataQueryKey(options)
    });
};

export const coingeckoControllerGetMarketChartDataQueryKey = (options: Options<CoingeckoControllerGetMarketChartDataData>) => [
    createQueryKey('coingeckoControllerGetMarketChartData', options)
];

export const coingeckoControllerGetMarketChartDataOptions = (options: Options<CoingeckoControllerGetMarketChartDataData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await coingeckoControllerGetMarketChartData({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: coingeckoControllerGetMarketChartDataQueryKey(options)
    });
};

export const coingeckoControllerUpdateCoinPricesMutation = (options?: Partial<Options>) => {
    const mutationOptions: UseMutationOptions<CoingeckoControllerUpdateCoinPricesResponse, AxiosError<DefaultError>, Options> = {
        mutationFn: async (localOptions) => {
            const { data } = await coingeckoControllerUpdateCoinPrices({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const coingeckoControllerUpdateMarketChartDataMutation = (options?: Partial<Options>) => {
    const mutationOptions: UseMutationOptions<CoingeckoControllerUpdateMarketChartDataResponse, AxiosError<DefaultError>, Options> = {
        mutationFn: async (localOptions) => {
            const { data } = await coingeckoControllerUpdateMarketChartData({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const transactionsControllerGetAllTransactionsQueryKey = (options?: Options) => [
    createQueryKey('transactionsControllerGetAllTransactions', options)
];

export const transactionsControllerGetAllTransactionsOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await transactionsControllerGetAllTransactions({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: transactionsControllerGetAllTransactionsQueryKey(options)
    });
};

export const transactionsControllerCreateTransactionQueryKey = (options: Options<TransactionsControllerCreateTransactionData>) => [
    createQueryKey('transactionsControllerCreateTransaction', options)
];

export const transactionsControllerCreateTransactionOptions = (options: Options<TransactionsControllerCreateTransactionData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await transactionsControllerCreateTransaction({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: transactionsControllerCreateTransactionQueryKey(options)
    });
};

export const transactionsControllerCreateTransactionMutation = (options?: Partial<Options<TransactionsControllerCreateTransactionData>>) => {
    const mutationOptions: UseMutationOptions<TransactionsControllerCreateTransactionResponse, AxiosError<DefaultError>, Options<TransactionsControllerCreateTransactionData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await transactionsControllerCreateTransaction({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const transactionsControllerGetAllTransactionsForInvestmentIdQueryKey = (options: Options<TransactionsControllerGetAllTransactionsForInvestmentIdData>) => [
    createQueryKey('transactionsControllerGetAllTransactionsForInvestmentId', options)
];

export const transactionsControllerGetAllTransactionsForInvestmentIdOptions = (options: Options<TransactionsControllerGetAllTransactionsForInvestmentIdData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await transactionsControllerGetAllTransactionsForInvestmentId({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: transactionsControllerGetAllTransactionsForInvestmentIdQueryKey(options)
    });
};

export const transactionsControllerDeleteTransactionMutation = (options?: Partial<Options<TransactionsControllerDeleteTransactionData>>) => {
    const mutationOptions: UseMutationOptions<unknown, AxiosError<DefaultError>, Options<TransactionsControllerDeleteTransactionData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await transactionsControllerDeleteTransaction({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const transactionsControllerGetTransactionByIdQueryKey = (options: Options<TransactionsControllerGetTransactionByIdData>) => [
    createQueryKey('transactionsControllerGetTransactionById', options)
];

export const transactionsControllerGetTransactionByIdOptions = (options: Options<TransactionsControllerGetTransactionByIdData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await transactionsControllerGetTransactionById({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: transactionsControllerGetTransactionByIdQueryKey(options)
    });
};

export const transactionsControllerUpdateTransactionMutation = (options?: Partial<Options<TransactionsControllerUpdateTransactionData>>) => {
    const mutationOptions: UseMutationOptions<TransactionsControllerUpdateTransactionResponse, AxiosError<DefaultError>, Options<TransactionsControllerUpdateTransactionData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await transactionsControllerUpdateTransaction({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const stakingsControllerGetAllStakingsQueryKey = (options?: Options) => [
    createQueryKey('stakingsControllerGetAllStakings', options)
];

export const stakingsControllerGetAllStakingsOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await stakingsControllerGetAllStakings({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: stakingsControllerGetAllStakingsQueryKey(options)
    });
};

export const stakingsControllerCreateStakingQueryKey = (options: Options<StakingsControllerCreateStakingData>) => [
    createQueryKey('stakingsControllerCreateStaking', options)
];

export const stakingsControllerCreateStakingOptions = (options: Options<StakingsControllerCreateStakingData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await stakingsControllerCreateStaking({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: stakingsControllerCreateStakingQueryKey(options)
    });
};

export const stakingsControllerCreateStakingMutation = (options?: Partial<Options<StakingsControllerCreateStakingData>>) => {
    const mutationOptions: UseMutationOptions<StakingsControllerCreateStakingResponse, AxiosError<DefaultError>, Options<StakingsControllerCreateStakingData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await stakingsControllerCreateStaking({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const stakingsControllerDeleteStakingMutation = (options?: Partial<Options<StakingsControllerDeleteStakingData>>) => {
    const mutationOptions: UseMutationOptions<unknown, AxiosError<DefaultError>, Options<StakingsControllerDeleteStakingData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await stakingsControllerDeleteStaking({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const stakingsControllerGetStakingByIdQueryKey = (options: Options<StakingsControllerGetStakingByIdData>) => [
    createQueryKey('stakingsControllerGetStakingById', options)
];

export const stakingsControllerGetStakingByIdOptions = (options: Options<StakingsControllerGetStakingByIdData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await stakingsControllerGetStakingById({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: stakingsControllerGetStakingByIdQueryKey(options)
    });
};

export const stakingsControllerUpdateStakingMutation = (options?: Partial<Options<StakingsControllerUpdateStakingData>>) => {
    const mutationOptions: UseMutationOptions<StakingsControllerUpdateStakingResponse, AxiosError<DefaultError>, Options<StakingsControllerUpdateStakingData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await stakingsControllerUpdateStaking({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const storageLocationsControllerFindAllQueryKey = (options?: Options) => [
    createQueryKey('storageLocationsControllerFindAll', options)
];

export const storageLocationsControllerFindAllOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await storageLocationsControllerFindAll({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: storageLocationsControllerFindAllQueryKey(options)
    });
};

export const storageLocationsControllerCreateQueryKey = (options: Options<StorageLocationsControllerCreateData>) => [
    createQueryKey('storageLocationsControllerCreate', options)
];

export const storageLocationsControllerCreateOptions = (options: Options<StorageLocationsControllerCreateData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await storageLocationsControllerCreate({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: storageLocationsControllerCreateQueryKey(options)
    });
};

export const storageLocationsControllerCreateMutation = (options?: Partial<Options<StorageLocationsControllerCreateData>>) => {
    const mutationOptions: UseMutationOptions<StorageLocationsControllerCreateResponse, AxiosError<DefaultError>, Options<StorageLocationsControllerCreateData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await storageLocationsControllerCreate({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const storageLocationsControllerDeleteMutation = (options?: Partial<Options<StorageLocationsControllerDeleteData>>) => {
    const mutationOptions: UseMutationOptions<unknown, AxiosError<DefaultError>, Options<StorageLocationsControllerDeleteData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await storageLocationsControllerDelete({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const storageLocationsControllerFindOneQueryKey = (options: Options<StorageLocationsControllerFindOneData>) => [
    createQueryKey('storageLocationsControllerFindOne', options)
];

export const storageLocationsControllerFindOneOptions = (options: Options<StorageLocationsControllerFindOneData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await storageLocationsControllerFindOne({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: storageLocationsControllerFindOneQueryKey(options)
    });
};

export const storageLocationsControllerUpdateMutation = (options?: Partial<Options<StorageLocationsControllerUpdateData>>) => {
    const mutationOptions: UseMutationOptions<StorageLocationsControllerUpdateResponse, AxiosError<DefaultError>, Options<StorageLocationsControllerUpdateData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await storageLocationsControllerUpdate({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const storageControllerFindAllQueryKey = (options?: Options) => [
    createQueryKey('storageControllerFindAll', options)
];

export const storageControllerFindAllOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await storageControllerFindAll({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: storageControllerFindAllQueryKey(options)
    });
};

export const storageControllerCreateQueryKey = (options: Options<StorageControllerCreateData>) => [
    createQueryKey('storageControllerCreate', options)
];

export const storageControllerCreateOptions = (options: Options<StorageControllerCreateData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await storageControllerCreate({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: storageControllerCreateQueryKey(options)
    });
};

export const storageControllerCreateMutation = (options?: Partial<Options<StorageControllerCreateData>>) => {
    const mutationOptions: UseMutationOptions<StorageControllerCreateResponse, AxiosError<DefaultError>, Options<StorageControllerCreateData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await storageControllerCreate({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const storageControllerDeleteMutation = (options?: Partial<Options<StorageControllerDeleteData>>) => {
    const mutationOptions: UseMutationOptions<unknown, AxiosError<DefaultError>, Options<StorageControllerDeleteData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await storageControllerDelete({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const storageControllerFindOneQueryKey = (options: Options<StorageControllerFindOneData>) => [
    createQueryKey('storageControllerFindOne', options)
];

export const storageControllerFindOneOptions = (options: Options<StorageControllerFindOneData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await storageControllerFindOne({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: storageControllerFindOneQueryKey(options)
    });
};

export const storageControllerUpdateMutation = (options?: Partial<Options<StorageControllerUpdateData>>) => {
    const mutationOptions: UseMutationOptions<StorageControllerUpdateResponse, AxiosError<DefaultError>, Options<StorageControllerUpdateData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await storageControllerUpdate({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const portfolioControllerGetPortfolioHistoryQueryKey = (options: Options<PortfolioControllerGetPortfolioHistoryData>) => [
    createQueryKey('portfolioControllerGetPortfolioHistory', options)
];

export const portfolioControllerGetPortfolioHistoryOptions = (options: Options<PortfolioControllerGetPortfolioHistoryData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await portfolioControllerGetPortfolioHistory({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: portfolioControllerGetPortfolioHistoryQueryKey(options)
    });
};