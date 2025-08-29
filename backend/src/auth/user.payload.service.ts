import { Injectable, Scope } from '@nestjs/common';
import { UserRole } from '../users/entities/abstract.user.entity';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class UserPayloadService {
  private id: string;
  private role: UserRole;
  private email: string;

  setId(id: string): void {
    this.id = id;
  }
  setRole(role: UserRole): void {
    this.role = role;
  }
  setEmail(email: string): void {
    this.email = email;
  }
  getId(): string {
    return this.id;
  }
  getRole(): UserRole {
    return this.role;
  }
  getEmail(): string {
    return this.email;
  }

  isValid(): boolean {
    if (this.id && this.role && this.email) {
      return true;
    }
    return false;
  }

  getPayload(): string {
    return JSON.stringify({
      id: this.id,
      role: this.role,
      email: this.email,
    });
  }
}
