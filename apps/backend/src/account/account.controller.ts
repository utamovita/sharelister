import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { UpdateUserDto } from '@repo/schemas';
import { type SuccessResponse, UserProfile } from '@repo/types';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import { AccountService } from './account.service';

@ApiTags('Account')
@Controller('account')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user profile.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(
    @Request() req: { user: UserProfile },
  ): SuccessResponse<UserProfile> {
    return { success: true, data: req.user };
  }

  @Patch()
  @ApiOperation({ summary: "Update current user's account details" })
  async updateProfile(
    @Request() req: { user: UserProfile },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.accountService.updateProfile(
      req.user.id,
      updateUserDto,
    );

    const { name } = updatedUser;
    return { success: true, data: name, message: 'success.profileUpdated' };
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 204, description: 'Account successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteAccount(@Request() req: { user: UserProfile }): Promise<void> {
    await this.accountService.deleteAccount(req.user.id);
  }
}
