import { Injectable, OnModuleInit } from '@nestjs/common';
import { type AppRouter, createAppRouter } from '@repo/trpc';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class TrpcRouter implements OnModuleInit {
  public appRouter!: AppRouter;

  constructor(private readonly accountService: AccountService) {}

  onModuleInit() {
    this.appRouter = createAppRouter({
      accountService: this.accountService,
    });
  }
}
