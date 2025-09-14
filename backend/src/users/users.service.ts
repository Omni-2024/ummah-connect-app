import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { SearchUserDto, UpdateUserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole } from './entities/abstract.user.entity';
import { ChangePasswordDtoNoOTP } from './dto/change-password-noOtp';


@Injectable()
export class UsersService {
  private readonly baseUrl;
  private readonly s3BucketUrl;
  constructor(
    private readonly userRepo: UserRepository,
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
        const { usersList, count } = await this.userRepo.searchUsers({
          query,
          limit,
          offset,
        });
        users = usersList;
        total = count;
      } else {
        const { count, usersList } = await this.userRepo.getAllUsersAndCount({
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
      return { status: HttpStatus.NOT_FOUND, error: 'No users found' };
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e.message };
    }
  }


  async retrieveUser(id: string) {
    const user = await this.userRepo.findOneById(id);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      };
    }

    await this.userRepo.retrieveUser(user);
    return user
  }


  async updateUser(
    updateUserDto: UpdateUserDto,
  ){
    const user = await this.userRepo.updateUser(updateUserDto);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      };
    }

    // TODO: Send email to user

    return user
  }

  async getUser(id: string) {
    const user = await this.userRepo.findOneById(id);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      };
    }
    return user
  }

  async deleteCurrentUser(
    id: string,
  ) {
    try {
      const user = await this.userRepo.findOneById(id);
      if (!user) {
        return { status: HttpStatus.NOT_FOUND, error: 'User not found' };
      }

      await this.userRepo.deleteCurrentUser(user.id);
      return user;
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }


  async deleteUser(id: string){
    const user = await this.userRepo.findOneById(id);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      };
    }

    await this.userRepo.deleteUser(user);
    return user
  }

  async changeStatus(
    id: string,
    status: boolean,
  ) {
    try {
      const user = await this.userRepo.changeStatus(id, status);

      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
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

  async changeRole(
    id: string,
    role: UserRole,
  ) {
      const user = await this.userRepo.changeRole(id, role);

      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Provider not found',
        };
      }
      return {
        status: HttpStatus.OK,
      };
  }


  async changePassword(dto: ChangePasswordDtoNoOTP): Promise<{ message: string }> {
  const { id, oldPassword, newPassword } = dto;

  const user = await this.userRepo.findOneById(id);
  if (!user) throw new NotFoundException("User not found");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new UnauthorizedException("Old password is incorrect");

  user.password = newPassword;
  await user.hashPassword();
  await this.userRepo.save(user);   // ✅ now works

  return { message: "Password updated successfully" };

}



}
