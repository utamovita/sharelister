import { Injectable, OnModuleInit } from '@nestjs/common';
import { type AppRouter, createAppRouter } from '@repo/trpc';
import { AccountService } from 'src/account/account.service';

import { GroupsService } from '../groups/groups.service';

@Injectable()
export class TrpcRouter implements OnModuleInit {
  public appRouter!: AppRouter;

  constructor(
    private readonly accountService: AccountService,
    private readonly groupsService: GroupsService,
  ) {}

  onModuleInit() {
    this.appRouter = createAppRouter({
      accountService: this.accountService,
      groupsService: this.groupsService,
    });
  }
}
