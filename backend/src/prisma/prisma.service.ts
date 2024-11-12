import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export function forUser(userId: string) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allOperations: async ({ args, query }) => {
          const [, result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('app.current_user_id', ${userId}::text, TRUE)`,
            query(args),
          ]);
          return result;
        },
      },
    }),
  );
}

export function bypassRLS() {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const [, result] = await prisma.$transaction([
              prisma.$executeRaw`SELECT set_config('app.bypass_rls', 'on', TRUE)`,
              query(args),
            ]);
            return result;
          },
        },
      },
    }),
  );
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async onModuleInit() {
    await this.prismaClient.$connect();
  }

  async onModuleDestroy() {
    await this.prismaClient.$disconnect();
  }

  public getPrismaClient(userId: string) {
    return this.prismaClient.$extends(forUser(userId));
  }

  public getPrismaRLSClient() {
    return this.prismaClient.$extends(bypassRLS());
  }
}
