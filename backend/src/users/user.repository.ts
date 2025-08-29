import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SigninMethod } from './entities/abstract.user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export  class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

  ) {}
  async register(registerDto: RegisterDto, token: string): Promise<UserEntity> {
    try {
      const newUser = this.userRepository.create(registerDto);
      console.log("ttttt",newUser);
      await newUser.hashPassword();
      newUser.token = token;
      console.log("reached");
      newUser.signinMethod = SigninMethod.EMAIL;
      console.log("new ",newUser);
      return await this.userRepository.save(newUser);
    } catch (error) {
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

  async setRefreshToken(userId: string, token: string ): Promise<void> {
    const result = await this.userRepository.update({ id: userId }, { token });
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }
}