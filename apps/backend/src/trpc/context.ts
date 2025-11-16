import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@repo/database';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { PrismaService } from '../prisma/prisma.service';

export interface ContextType {
  user: User | null;
  prisma: PrismaService;
}

export type TRCPContext = ContextType;

export const createTRPCContext = async (
  { req }: CreateExpressContextOptions,
  prisma: PrismaService,
  jwtService: JwtService,
  configService: ConfigService,
): Promise<TRCPContext> => {
  async function getUserFromHeader(): Promise<User | null> {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return null;
      }

      try {
        const payload = await jwtService.verifyAsync<{ sub: string }>(token, {
          secret: configService.get<string>('JWT_SECRET'),
        });
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
        });

        return user;
      } catch {
        return null;
      }
    }

    return null;
  }

  const user = await getUserFromHeader();

  return { user, prisma };
};
