// src/users/users.service.ts
import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(dto.password, salt);

    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      password: hash,
      salt,
      verified: false,
      is_first_login: true,
    });

    return this.repo.save(user);
  }

  async findByEmail(email: string, withSensitive = false): Promise<User | null> {
    if (withSensitive) {
      return this.repo
        .createQueryBuilder('u')
        .addSelect(['u.password', 'u.salt', 'u.token'])
        .where('u.email = :email', { email })
        .getOne();
    }
    return this.repo.findOne({ where: { email } });
  }

  async setRefreshToken(userId: string, refreshToken: string | null) {
    // store hashed refresh token (or null to revoke)
    const hashed = refreshToken ? await bcrypt.hash(refreshToken, 12) : null;
    await this.repo.update({ _id: userId }, { token: hashed });
  }

  async compareRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.repo
      .createQueryBuilder('u')
      .addSelect(['u.token'])
      .where('u._id = :id', { id: userId })
      .getOne();
    if (!user?.token) return false;
    return bcrypt.compare(refreshToken, user.token);
  }

  async getById(userId: string): Promise<User> {
    const user = await this.repo.findOne({ where: { _id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
