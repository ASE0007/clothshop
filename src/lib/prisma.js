import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prisma = globalForPrisma;

export default globalForPrisma;