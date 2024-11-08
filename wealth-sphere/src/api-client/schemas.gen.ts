// This file is auto-generated by @hey-api/openapi-ts

export const CreateInvestmentDtoSchema = {
    type: 'object',
    properties: {
        coinId: {
            type: 'string'
        }
    },
    required: ['coinId']
} as const;

export const CreateTransactionDtoSchema = {
    type: 'object',
    properties: {
        investmentId: {
            type: 'string'
        },
        quantity: {
            type: 'number'
        },
        price: {
            type: 'number'
        },
        date: {
            type: 'string',
            format: 'date-time'
        },
        type: {
            type: 'string',
            enum: ['buy', 'sell']
        }
    },
    required: ['investmentId', 'quantity', 'price', 'date', 'type']
} as const;

export const UpdateTransactionDtoSchema = {
    type: 'object',
    properties: {
        quantity: {
            type: 'number'
        },
        price: {
            type: 'number'
        },
        date: {
            type: 'string',
            format: 'date-time'
        },
        type: {
            type: 'string',
            enum: ['buy', 'sell']
        }
    }
} as const;

export const CreateStakingDtoSchema = {
    type: 'object',
    properties: {
        investmentId: {
            type: 'string',
            format: 'uuid'
        },
        amount: {
            type: 'number',
            exclusiveMinimum: true,
            minimum: 0
        },
        storageLocationId: {
            type: 'string',
            format: 'uuid'
        },
        websiteLink: {
            type: 'string'
        },
        coolDownPeriod: {
            type: 'number',
            exclusiveMinimum: true,
            minimum: 0
        },
        startDate: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: ['investmentId', 'amount', 'storageLocationId', 'websiteLink', 'coolDownPeriod', 'startDate']
} as const;

export const UpdateStakingDtoSchema = {
    type: 'object',
    properties: {
        amount: {
            type: 'number',
            exclusiveMinimum: true,
            minimum: 0
        },
        storageLocationId: {
            type: 'string',
            format: 'uuid'
        },
        websiteLink: {
            type: 'string'
        },
        coolDownPeriod: {
            type: 'number',
            exclusiveMinimum: true,
            minimum: 0
        },
        startDate: {
            type: 'string',
            format: 'date-time'
        }
    }
} as const;

export const CreateStorageLocationDtoSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        image: {
            type: 'string'
        },
        storageLocationType: {
            type: 'string',
            enum: ['hardwareWallet', 'softwareWallet', 'exchange']
        }
    },
    required: ['name', 'image', 'storageLocationType']
} as const;

export const UpdateStorageLocationDtoSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        image: {
            type: 'string'
        },
        storageLocationType: {
            type: 'string',
            enum: ['hardwareWallet', 'softwareWallet', 'exchange']
        }
    }
} as const;

export const CreateStorageDtoSchema = {
    type: 'object',
    properties: {
        investmentId: {
            type: 'string',
            format: 'uuid'
        },
        amount: {
            type: 'number',
            exclusiveMinimum: true,
            minimum: 0
        },
        storageLocationId: {
            type: 'string',
            format: 'uuid'
        },
        date: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: ['investmentId', 'amount', 'storageLocationId', 'date']
} as const;

export const UpdateStorageDtoSchema = {
    type: 'object',
    properties: {
        amount: {
            type: 'number',
            exclusiveMinimum: true,
            minimum: 0
        },
        storageLocationId: {
            type: 'string',
            format: 'uuid'
        },
        date: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: ['amount', 'storageLocationId', 'date']
} as const;