import { All, Controller, Next, Req, Res } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { NextFunction, Request, Response } from 'express';

import { TrpcService } from './trpc.service';

@Controller('trpc')
export class TrpcController {
  constructor(private readonly trpcService: TrpcService) {}

  @All('*')
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const handler = trpcExpress.createExpressMiddleware({
      router: this.trpcService.trpcRouter.appRouter,
      createContext: this.trpcService.createContext,
    });

    return handler(req, res, next);
  }
}
