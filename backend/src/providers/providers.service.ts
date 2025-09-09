import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchUserDto } from '../users/dto/user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { ProviderRepository } from './providers.repository';
import { UserRole } from '../users/entities/abstract.user.entity';

@Injectable()
export class ProvidersService {
  private readonly baseUrl;
  private readonly s3BucketUrl;
  constructor(
    private readonly providerRepo: ProviderRepository,
    private readonly configService: ConfigService,
  ) {}

  async findAll({
                  limit,
                  offset,
                  query,
                }: SearchUserDto) {
    try {
      let users, total;
      if (query) {
        const { usersList, count } = await this.providerRepo.searchUsers({
          query,
          limit,
          offset,
        });
        users = usersList;
        total = count;
      } else {
        const { count, usersList } = await this.providerRepo.getAllUsersAndCount({
          limit,
          offset,
        });
        total = count;
        users = usersList;
      }
      if (
        users instanceof Array &&
        users.length > 0 &&
        users[0] instanceof UserEntity &&
        total
      ) {
        return {
          data: users, meta: { total, limit, offset  }
        };
      }
      return { status: HttpStatus.NOT_FOUND, error: 'No providers found' };
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e.message };
    }
  }


  async retrieveUser(id: string) {
    const user = await this.providerRepo.findOneById(id);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'Provider not found',
      };
    }

    await this.providerRepo.retrieveUser(user);
    return user
  }

  async changeRole(
    id: string,
    role: UserRole,
  ) {
    try {
      const user = await this.providerRepo.changeRole(id, role);

      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Provider not found',
        };
      }
      return {
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }




  }
