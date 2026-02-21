import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from './entities/abstract.user.entity';
import { UsersService } from './users.service';
import { Public } from '../auth/decorator/public.decorator';
import { UpdateUserDto } from './dto/user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles([UserRole.ADMIN, UserRole.ROOT, UserRole.BUSINESS_ADMIN])
  @Get('/all')
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('query') query?: string,
  ) {
    return await this.userService.findAll({
      limit,
      offset,
      query,
    });
  }

  @Roles([UserRole.ADMIN, UserRole.ROOT, UserRole.BUSINESS_ADMIN])
  @Get('/all-blocked')
  async findAllBlocked(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('query') query?: string,
  ) {
    return await this.userService.findAllBlocked({
      limit,
      offset,
      query,
    });
  }

  @Patch('/:id/retrieve')
  async retrieveUser(@Param('id') id: string) {
    return await this.userService.retrieveUser(id);
  }

  @Roles([
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.ROOT,
    UserRole.BUSINESS_ADMIN,
  ])
  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser({ ...updateUserDto, id });
  }

  // TODO: Should get user id from AuthGuard
  // @Roles([UserRole.USER, UserRole.ADMIN, UserRole.ROOT, UserRole.BUSINESS_ADMIN])
  @Public()
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }

  // TODO: Should get user id from AuthGuard
  @Roles([
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.ROOT,
    UserRole.BUSINESS_ADMIN,
  ])
  @Delete('/:id/delete')
  async deleteCurrentUser(@Param('id') id: string) {
    return await this.userService.deleteCurrentUser(id);
  }

  @Roles([
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.ROOT,
    UserRole.BUSINESS_ADMIN,
  ])
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
  @Roles([
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.ROOT,
    UserRole.BUSINESS_ADMIN,
  ])
  @Delete('/unblock/:id')
  async unblockUser(@Param('id') id: string) {
    return await this.userService.unblockUser(id);
  }

  @Roles([
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.ROOT,
    UserRole.BUSINESS_ADMIN,
  ])
  @Delete('force/:id')
  async forceDeleteUser(@Param('id') id: string) {
    return await this.userService.forceDeleteUser(id);
  }

  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Patch('/:id/change-status')
  async changeStatus(
    @Param('id') id: string,
    @Body() body: { status: boolean },
  ) {
    return await this.userService.changeStatus(id, body.status);
  }

  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Patch('/:id/change-role')
  async changeRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
    return await this.userService.changeRole(id, body.role);
  }

  // ✅ Updated change password route
  @Patch('/:id/change-password')
  async changePasswordNoOtp(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.userService.changePassword({
      id,
      oldPassword: body.oldPassword,
      newPassword: body.newPassword,
    });
  }
}

  // @Public()
  // @Post('verify-turnstile')
  // async verifyTurnstile(@Body() verifyTurnstileDto: any) {
  //   const isSuccess = await this.userService.verifyToken(verifyTurnstileDto.token);
  //
  //   if (isSuccess) {
  //     return { success: true, message: 'Verification successful' };
  //   } else {
  //     return { success: false, message: 'Invalid token' };
  //   }
  // }


