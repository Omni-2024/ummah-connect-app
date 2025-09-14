export interface SocialLogin {
  login?(token: string);
  appleLogin?(token: string, name?: string);
}