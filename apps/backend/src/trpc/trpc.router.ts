import { Injectable, OnModuleInit } from '@nestjs/common';
import { type AppRouter, createAppRouter } from '@repo/trpc';
import { AccountService } from 'src/account/account.service';
import { InvitationsService } from 'src/invitations/invitations.service'; // <-- Import
import { ShoppingListService } from 'src/shopping-list/shopping-list.service';

import { AuthService } from '../auth/auth.service';
import { GroupsService } from '../groups/groups.service';

@Injectable()
export class TrpcRouter implements OnModuleInit {
  public appRouter!: AppRouter;

  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly groupsService: GroupsService,
    private readonly invitationsService: InvitationsService,
    private readonly shoppingListService: ShoppingListService,
  ) {}

  onModuleInit() {
    this.appRouter = createAppRouter({
      authService: this.authService,
      accountService: this.accountService,
      groupsService: this.groupsService,
      invitationsService: this.invitationsService,
      shoppingListService: this.shoppingListService,
    });
  }
}
