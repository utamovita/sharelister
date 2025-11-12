import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserProfile } from '@repo/types';

import { PrismaService } from '../../prisma/prisma.service';

interface RequestWithUserAndParams extends Request {
  user: UserProfile;
  params: {
    groupId: string;
  };
}

@Injectable()
export class GroupMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUserAndParams>();

    const user = request.user;
    const groupId = request.params.groupId;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!user || !groupId) {
      return false;
    }

    const membership = await this.prisma.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId,
        },
      },
      select: {
        userId: true,
      },
    });

    if (membership) {
      return true;
    }

    throw new ForbiddenException('group.notAMember');
  }
}
