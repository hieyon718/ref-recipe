// server/src/config/db.ts
import { PrismaClient } from '@prisma/client';

// 프로젝트 전역에서 사용할 Prisma 인스턴스입니다.
// Spring의 레포지토리나 매니저 객체처럼 사용됩니다.
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;