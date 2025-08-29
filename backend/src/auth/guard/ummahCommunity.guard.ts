import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPayloadService } from '../user.payload.service';
import { Roles } from '../decorator/role.decorator';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { UserRole } from '../../users/entities/abstract.user.entity';
import { JwtPayload } from '../types/jwt-payload.type';


@Injectable()
export class UmmahCommunityGuard implements CanActivate {
  private readonly logger: Logger = new Logger(UmmahCommunityGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly userPayloadService: UserPayloadService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    this.logger.debug(`Token: ${token}`);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.authService.validateToken(token);
    // 💡 We're assigning the payload to the request object here
    this.setUser(payload.data !!);
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);
    this.logger.debug(`User Payload: ${this.userPayloadService.getPayload()}`);

    return this.RoleGuard(context);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    const [type, token] = authorizationHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getClass(),
      context.getHandler(),
    ]);
  }

  private setUser(payload: JwtPayload): void {
    const { email, id, role } = payload;
    this.userPayloadService.setEmail(email);
    this.userPayloadService.setId(id);
    this.userPayloadService.setRole(role);
  }

  private RoleGuard(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>(Roles, context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }
    return roles.some((role) => role === this.userPayloadService.getRole());
  }
}
