import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { ILike, Like, Repository } from 'typeorm';
import { SearchUserDto } from '../users/dto/user.dto';
import { UserRole } from '../users/entities/abstract.user.entity';
import { PaginatedRequestDto } from '../users/dto/base.dto';

@Injectable()
export class ProviderRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async searchUsers({
                      query,
                      limit,
                      offset,
                    }: SearchUserDto): Promise<{ usersList: UserEntity[]; count: number }> {
    try {
      const options: FindOptions = {};
      if (limit && limit > 0) {
        options.take = limit;
      }
      if (offset && offset > 0) {
        options.skip = offset;
      }
      const [usersList, count] = await this.userRepository.findAndCount({
        ...options,
        where: [
          {
            role: UserRole.BUSINESS_ADMIN,
            email: Like(`%${query?.toLowerCase()}%`),
          },
          {
            role: UserRole.BUSINESS_ADMIN,
            name: ILike(`%${query}%`),
          },
        ],
        order: {
          createdAt: 'DESC',
        },
      });
      return { usersList, count };
    } catch (error) {
      throw error;
    }
  }

  async getAllUsersAndCount({
                              limit,
                              offset,
                            }: PaginatedRequestDto): Promise<{ usersList: UserEntity[]; count: number }> {
    try {
      const options: FindOptions = {
        order: { createdAt: 'DESC' },
        where: { role: UserRole.BUSINESS_ADMIN },
      };
      if ((limit && limit > 0) || (offset && offset > 0)) {
        options.take = limit;
        options.skip = offset;
      }

      options.order = {
        createdAt: 'DESC',
      };

      const [usersList, count] =
        await this.userRepository.findAndCount(options);
      return { usersList, count };
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('Provider not found');
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  async retrieveUser(user: UserEntity) {
    try {
      user.active = true;
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async changeRole(id: string, role: UserRole): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('Provider not found');
      }
      user.role = role;
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }




}

interface FindOptions {
  take?: number;
  skip?: number;
  order?: {
    createdAt?: 'ASC' | 'DESC';
  };
  where?: any;
}