import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Group } from '@repo/database';
import { SuccessResponse, UserProfile } from '@repo/types';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import { CreateGroupDto } from './dto/create-group.dto';
import { GroupsService } from './groups.service';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Request() req: { user: UserProfile },
  ): Promise<SuccessResponse<Group>> {
    const group = await this.groupsService.create(createGroupDto, req.user.id);
    return { success: true, data: group };
  }
}
