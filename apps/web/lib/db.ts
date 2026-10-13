import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../generated/prisma/client.ts';
export { Prisma };
export type Transaction = Prisma.TransactionClient;
const globalDb = globalThis as unknown as { travelwiseDb?: PrismaClient };
export function db(): PrismaClient {
 if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
 return globalDb.travelwiseDb ??= new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL,max:10,connectionTimeoutMillis:5000})});
}
export async function lock(tx: Transaction, key: string) {
 await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtext(${key}))`;
}
