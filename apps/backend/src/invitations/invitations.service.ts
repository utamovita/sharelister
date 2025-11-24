import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvitationDto } from '@repo/schemas';
import { IInvitationsService } from '@repo/trpc/services';
import { Invitation, ROLES } from '@repo/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvitationsService implements IInvitationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    groupId: string,
    invitingUserId: string,
    createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation> {
    const { email } = createInvitationDto;

    const invitedUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      throw new NotFoundException('User with this email not found.');
    }

    if (invitingUserId === invitedUser.id) {
      throw new BadRequestException('You cannot invite yourself.');
    }

    const existingMembership = await this.prisma.groupMembership.findFirst({
      where: { groupId, userId: invitedUser.id },
    });

    if (existingMembership) {
      throw new ConflictException(
        'This user is already a member of the group.',
      );
    }

    const existingInvitation = await this.prisma.invitation.findFirst({
      where: { groupId, email },
    });

    if (existingInvitation) {
      throw new ConflictException(
        'An invitation has already been sent to this user for this group.',
      );
    }

    return this.prisma.invitation.create({
      data: {
        email,
        groupId,
        invitedByUserId: invitingUserId,
      },
      include: {
        group: {
          select: { id: true, name: true },
        },
        invitedByUser: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findAllReceivedForUser(userId: string): Promise<Invitation[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.prisma.invitation.findMany({
      where: {
        email: user.email,
      },
      include: {
        group: {
          select: { id: true, name: true },
        },
        invitedByUser: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async accept(invitationId: string, userId: string): Promise<void> {
    const invitation = await this.findAndVerifyInvitation(invitationId, userId);

    await this.prisma.$transaction(async (tx) => {
      await tx.groupMembership.create({
        data: {
          userId: userId,
          groupId: invitation.groupId,
          role: ROLES.USER,
        },
      });

      await tx.invitation.delete({
        where: { id: invitationId },
      });
    });
  }

  async decline(invitationId: string, userId: string): Promise<void> {
    await this.findAndVerifyInvitation(invitationId, userId);
    await this.prisma.invitation.delete({ where: { id: invitationId } });
  }

  private async findAndVerifyInvitation(invitationId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found.');
    }

    if (invitation.email !== user.email) {
      throw new ForbiddenException('This invitation is not for you.');
    }

    return invitation;
  }
}
