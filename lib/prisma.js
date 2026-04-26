import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
// const prisma = new PrismaClient();
// export { prisma };

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;