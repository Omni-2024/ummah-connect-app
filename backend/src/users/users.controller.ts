import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from './entities/abstract.user.entity';
import { UsersService } from './users.service';
import { Public } from '../auth/decorator/public.decorator';
import { SearchUserDto, UpdateUserDto } from './dto/user.dto';


@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UsersService
  ) {
  }

  @Roles([UserRole.ADMIN, UserRole.ROOT])
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

  @Patch('/:id/retrieve')
  async retrieveUser(@Param('id') id: string) {
    return await this.userService.retrieveUser(id);
  }

  @Roles([UserRole.USER, UserRole.ADMIN, UserRole.ROOT, UserRole.BUSINESS_USER])
  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser( { ...updateUserDto, id });
  }

  // TODO: Should get user id from AuthGuard
  @Roles([UserRole.USER, UserRole.ADMIN, UserRole.ROOT, UserRole.BUSINESS_USER])
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }

  // TODO: Should get user id from AuthGuard
  @Roles([UserRole.USER, UserRole.ADMIN, UserRole.ROOT, UserRole.BUSINESS_USER])
  @Delete('/:id/delete')
  async deleteCurrentUser(@Param('id') id: string) {
    return await this.userService.deleteCurrentUser(id);
  }

  @Roles([UserRole.USER, UserRole.ADMIN, UserRole.ROOT, UserRole.BUSINESS_USER])
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
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
  async changeRole(
    @Param('id') id: string,
    @Body() body: { role: UserRole },
  ) {
    return await this.userService.changeRole(id, body.role);
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

}
