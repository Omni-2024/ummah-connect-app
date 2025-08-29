export class ServiceResponseDto<T = void> {
  status!: number;
  data?: T;
  error?: any;
}