import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '../users/entities/abstract.user.entity';
import { ProvidersService } from './providers.service';

@Controller('provider')
export class ProvidersController {
  constructor(private readonly providerService: ProvidersService) {}

  @Roles([UserRole.ADMIN, UserRole.ROOT, UserRole.BUSINESS_ADMIN])
  @Get('/all')
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('query') query?: string,
  ) {
    return await this.providerService.findAll({
      limit,
      offset,
      query,
    });
  }

  @Patch('/:id/retrieve')
  async retrieveProvider(@Param('id') id: string) {
    return await this.providerService.retrieveUser(id);
  }

  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Patch('/:id/change-role')
  async changeRole(
    @Param('id') id: string,
    @Body() body: { role: UserRole },
  ) {
    return await this.providerService.changeRole(id, body.role);
  }
}
