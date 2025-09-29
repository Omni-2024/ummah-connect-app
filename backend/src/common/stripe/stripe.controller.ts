import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Public } from '../../auth/decorator/public.decorator';
import { Roles } from '../../auth/decorator/role.decorator';
import { UserRole } from '../../users/entities/abstract.user.entity';
import { CreateCheckoutDto, CreateCustomerDto } from './dto/strip.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }


  @Post()
  async createCustomer(@Body() createCustomer: CreateCustomerDto) {
    return await this.stripeService.createCustomer(createCustomer);
  }

  @Roles([UserRole.USER, UserRole.BUSINESS_ADMIN])
  @Post('create-checkout-session')
  async createCheckout(@Body() createCheckoutDto: {
    userId: string;
    serviceId: string;
    mode: 'embedded' | 'hosted';
    platform?:string
  }) {
    return await this.stripeService.createCheckout(createCheckoutDto);
  }


  @Roles([UserRole.USER, UserRole.BUSINESS_ADMIN])
  @Get('session-status')
  async sessionStatus(@Query('sessionId') sessionId: string) {
    return await this.stripeService.sessionStatus({ sessionId: sessionId });
  }

  @Roles([UserRole.USER, UserRole.BUSINESS_ADMIN])
  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentIntentDto: CreateCheckoutDto) {
    return await this.stripeService.createPaymentIntent(createPaymentIntentDto);
  }



  @Post('webhook')
  @Public()
  async stripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = request.rawBody ;
    return await this.stripeService.stripeWebhook({ rawBody, signature });
  }
}
