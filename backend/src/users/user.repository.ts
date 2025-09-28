import { RegisterDto, RegisterSocialDto } from './dto/register.dto';
import { UserEntity } from './entities/user.entity';
import { ILike, Like, QueryFailedError, Repository } from 'typeorm';
import { SigninMethod, UserRole } from './entities/abstract.user.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchUserDto, UpdateUserDto } from './dto/user.dto';
import { PaginatedRequestDto } from './dto/base.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async register(registerDto: RegisterDto, token: string): Promise<UserEntity> {
    try {
      const newUser = this.userRepository.create(registerDto);
      await newUser.hashPassword();
      newUser.token = token;
      newUser.signinMethod = SigninMethod.EMAIL;
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async registerSocial(
    registerSocialDto: RegisterSocialDto,
  ): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({
        email: registerSocialDto.email,
      });
      if (user) {
        return user;
      }
      const newUser = this.userRepository.create(registerSocialDto);
      newUser.verified = true;
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Deleted user cannot be registered');
      }
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  async update(user: UserEntity) {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  async findOneVerifiedById(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({
        id,
        verified: true,
        active: true,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  async setRefreshToken(userId: string, token: string): Promise<void> {
    const result = await this.userRepository.update({ id: userId }, { token });
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

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
            role: UserRole.USER,
            email: Like(`%${query?.toLowerCase()}%`),
          },
          {
            role: UserRole.USER,
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
        where: { role: UserRole.USER },
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

  async retrieveUser(user: UserEntity) {
    try {
      user.active = true;
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({
        id: updateUserDto.id,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isFirstLogin) {
        user.isFirstLogin = false;
      }

      const updatedUser = this.userRepository.merge(user, updateUserDto);
      return await this.userRepository.save(updatedUser);
    } catch (e) {
      throw e;
    }
  }

  async deleteCurrentUser(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.deletedAt = new Date();
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(user: UserEntity) {
    try {
      user.active = false;
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async changeStatus(id: string, status: boolean): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.active = status;
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

  async updateCustomerId(
    id: string,
    stripeCustomerId: string,
  ): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.stripeCustomerId = stripeCustomerId;
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
