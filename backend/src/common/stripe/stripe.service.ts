import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UserRepository } from '../../users/user.repository';
import { ServiceRepository } from '../../services/service.repository';
import { AbstractServiceEntity } from '../../services/entities/abstract.service.entity';
import { EnrollUserDto } from '../../enrollments/dto/enrollment.dto';
import {
  CreateCheckoutDto,
  GetSessionStatusResponseDto,
} from './dto/strip.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { PurchaseType } from './dto/stripe.entity';
import { AbstractProfessionCategoryEntity } from '../../categories/profession/entities/abstract.profession.entity';
import { ProfessionRepository } from '../../categories/profession/profession.repository';
import { UpsertPaymentDto } from '../../payment/dto/payment.dto';
import { PaymentService } from '../../payment/payment.service';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly baseUrl;
  private readonly r2BaseUrl;
  private readonly webhookSecret;
  private readonly commissionPercentage;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly userRepo: UserRepository,
    private readonly serviceRepo: ServiceRepository,
    private readonly professionRepo: ProfessionRepository,
    private readonly paymentService: PaymentService,

  ) {
    this.r2BaseUrl=this.configService.getOrThrow<string>('R2_PUBLIC_BASE_URL')
    this.commissionPercentage=this.configService.getOrThrow<string>('STRIPE_COMMISSION_PERCENTAGE')
    const stripeSecret=this.configService.getOrThrow<string>('STRIPE_SECRET')
    this.stripe = new Stripe(stripeSecret);
    this.baseUrl = this.configService.getOrThrow<string>('APP_BASE_URL');
    this.webhookSecret=this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');
  }

  async createCustomer(customerRegisterDto: {
    userId: string;
    name: string;
    email: string;
  }){
      //need to remove any after updating common
      const user: any = await this.userService.getUser(
        customerRegisterDto.userId,
      );

      if (!user.stripeCustomerId) {
        const customer = await this.stripe.customers.create({
          name: customerRegisterDto.name,
          email: customerRegisterDto.email,
        });
        await this.userService.updateCustomerId(
          customerRegisterDto.userId,
          customer.id,
        );
      }

      return { status: HttpStatus.OK };
  }

  async createConnectedAccount(providerId: string) {
    const provider = await this.userRepo.findOneById(providerId);
    if (!provider) throw new BadRequestException('Provider not found');

    if (!provider.stripeConnectAccountId) {
      const account = await this.stripe.accounts.create({
        type: 'express', // or 'standard' based on your flow
        email: provider.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      provider.stripeConnectAccountId = account.id;

      await this.userRepo.update(provider);

      return { status: HttpStatus.OK, stripeConnectAccountId: account.id };
    }

    return { status: HttpStatus.OK, stripeConnectAccountId: provider.stripeConnectAccountId };
  }

  async generateOnboardingLink(providerId: string) {
    const provider = await this.userRepo.findOneById(providerId);
    if (!provider?.stripeConnectAccountId)
      throw new BadRequestException('Provider has no Stripe account');

    const accountLink = await this.stripe.accountLinks.create({
      account: provider.stripeConnectAccountId,
      refresh_url: `${this.baseUrl}/dashboard/payments/onboarding/refresh`,
      return_url: `${this.baseUrl}/dashboard/payments/onboarding/complete`,
      type: 'account_onboarding',
    });

    return { url: accountLink.url };
  }

  async checkConnectedAccountStatus(providerId: string) {
    const provider = await this.userRepo.findOneById(providerId);
    if (!provider?.stripeConnectAccountId)
      throw new BadRequestException('Provider has no Stripe account');

    const account = await this.stripe.accounts.retrieve(provider.stripeConnectAccountId);
    return {
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    };
  }

  async createCheckout(createCheckoutDto: {
    userId: string;
    serviceId: string;
    mode: 'embedded' | 'hosted';
    platform?: string;
  }){
    const { platform = 'legacy' } = createCheckoutDto;

        //find user by id
      //need to remove any after updating common
      const user: any = await this.userService.getUser(
        createCheckoutDto.userId,
      );

      const stripeCustomerId = user.stripeCustomerId;

      if (!stripeCustomerId) {
        return { status: HttpStatus.NOT_FOUND, error: 'Customer not found' };
      }

      let price: number = 0;
      let productName: string = '';
      let productTagline: string = '';
      let productImage: string = '';
      let metadata: any = {};
      let discount: number = 0;
      let discountEnabled: boolean = false;


      const service=await this.serviceRepo.getServiceById({id:createCheckoutDto.serviceId})
      if (!service) {
        return { status: HttpStatus.NOT_FOUND, error: 'Service not found' };
      }

      productName = (service as AbstractServiceEntity).title;
      productTagline = (service as AbstractServiceEntity).tagline;
      productImage = (service as AbstractServiceEntity).coverImageUrl;
      price = (service as AbstractServiceEntity).price;
      discount = (service as AbstractServiceEntity).discount;
      discountEnabled = (service as AbstractServiceEntity).discountEnabled;
      metadata = {
        type: 'service',
        service_id: createCheckoutDto.serviceId,
        user_id: createCheckoutDto.userId,
        service_name: productName,
      };

      const provider: any = await this.userService.getUser(
        service.providerId,
      );


      if (discountEnabled && discount > 0) {
        price = price - (price / 100) * discount;
      }

      const lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productTagline,
              images: [`${this.r2BaseUrl}/${productImage}`],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ];

      if (createCheckoutDto.mode === 'embedded') {
        const platformFeePercentage = this.commissionPercentage;
        const amountInCents = Math.round(price * 100);
        const applicationFeeAmount = Math.round(amountInCents * platformFeePercentage);
              const session = await this.stripe.checkout.sessions.create({
                  ui_mode: 'embedded',
                  payment_method_types: ['card'],
                  line_items: lineItems,
                  mode: 'payment',
                  return_url: `${this.baseUrl}/payment-processing?session_id={CHECKOUT_SESSION_ID}`,
                  customer: stripeCustomerId,
                  saved_payment_method_options: {
                      payment_method_save: 'enabled',
                  },
                  payment_intent_data: {
                    application_fee_amount: applicationFeeAmount,
                    transfer_data: {
                      destination: provider.stripeConnectAccountId,
                    },
                  },
                  metadata: metadata,
              });

              return {
                  status: HttpStatus.OK,
                  data: {
                      clientSecret: session.client_secret,
                      session: session,
                  },
              };
      } else if (createCheckoutDto.mode === 'hosted') {
        const session = await this.stripe.checkout.sessions.create({
          ui_mode: 'hosted',
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${this.baseUrl}/ios/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${this.baseUrl}/ios/payment-cancel`,
          customer: stripeCustomerId,
          saved_payment_method_options: {
            payment_method_save: 'enabled',
          },
          metadata: {
            service_id: createCheckoutDto.serviceId,
            user_id: createCheckoutDto.userId,
            service_name: productName,
          },
        });

        return {
          status: HttpStatus.OK,
          data: {
            clientSecret: session.client_secret,
            session: session,
          },
        };
      }

      return { status: HttpStatus.BAD_REQUEST, error: 'Invalid mode' };
  }

  async sessionStatus(sessionStatus: {
    sessionId: string;
  }){
      // Retrieve the Stripe session
      const session = await this.stripe.checkout.sessions.retrieve(
        sessionStatus.sessionId,
      );

      // Extract metadata values with fallback defaults
      const serviceId = session.metadata?.service_id ?? null;
      const userId = session.metadata?.user_id ?? null;
      const serviceName = session.metadata?.service_name ?? null;

      // Handle different payment statuses
      switch (session.payment_status) {
        case 'paid': {
          // Prepare enrollment data for course or webinar
          const enrollData: EnrollUserDto = {
            serviceId: serviceId || '',
            userId: userId || '',
          };

          // Retrieve user details
          const user = await this.userRepo.findOneById(enrollData.userId);
          if (!user) {
            throw new BadRequestException('User not found');
          }

          // Handle course enrollment if courseId is available
          if (enrollData.serviceId) {
            const service=await this.serviceRepo.getServiceById({id:enrollData.serviceId})


            if (!service) {
              throw new BadRequestException('Course not found');
            }

            const { title, slug } = Array.isArray(service)
              ? service[0]
              : service;


            // Send the email
            //TODO:email

            // await this.notificationService.sendEmail(emailData);
          }

          break;
        }

        case 'unpaid':
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Payment is unpaid',
          };

        default:
          console.log(
            `Unhandled session payment status: ${session.payment_status}`,
          );
          return {
            status: HttpStatus.BAD_REQUEST,
            error: `Unhandled session payment status ${session.payment_status}`,
          };
      }

      // Return session status and metadata in response
      const response: GetSessionStatusResponseDto = {
        status: session.status || null, // Ensure status is either string or null
        metadata: {
          service_id: serviceId || null,
          user_id: userId || null,
          service_name: serviceName || null,
        },
      };

      return  response ;
  }

  async createPaymentIntent(
    createPaymentIntentDto: CreateCheckoutDto,
  ) {
      const user: UserEntity = await this.userRepo.findOneById(
        createPaymentIntentDto.userId,
      );

      // Validate Stripe customer
      const stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User does not have a Stripe customer ID',
        };
      }

      const service = await this.handlePurchaseType(createPaymentIntentDto);

      const price = this.calculatePrice(service);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(price * 100),
        currency: 'usd',
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        metadata: {
          service_id: service.id,
          user_id: user.id,
          service_name: service.title,
          purchaseType: PurchaseType.SINGLE,
        },
      });

      return  paymentIntent ;
  }

  async handlePurchaseType(createCheckoutDto: CreateCheckoutDto): Promise<any> {
    let result: AbstractServiceEntity | AbstractProfessionCategoryEntity | null =
      null;

    // const fetchData = async <T>(
    //   pattern: string,
    //   id: string,
    // ): Promise<T | null> => {
    //   const response = await firstValueFrom(
    //     this.courseService.send<MicroserviceResponseDto<T>, { id: string }>(
    //       pattern,
    //       { id },
    //     ),
    //   );
    //   return response.data
    //     ? Array.isArray(response.data)
    //       ? response.data[0]
    //       : response.data
    //     : null;
    // };

    const { purchaseType, serviceId, categoryId, priceId } = createCheckoutDto;

    switch (purchaseType) {
      case PurchaseType.SINGLE:
        if (serviceId) {
          result = await this.serviceRepo.getServiceById({id:serviceId})
        }
        break;

      case PurchaseType.CATEGORY:
        if (categoryId && priceId) {
          result = await this.professionRepo.findOne({id:categoryId})
          //   await fetchData<AbstractProfessionCategoryEntity>(
          //   ProfessionMessagePattern.findOne,
          //   categoryId,
          // );
        }
        break;

      case PurchaseType.UNLIMITED:
        if (priceId) {
          // No additional data fetch needed; logic will rely on input
          return;
        }
        break;

      default:
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid PurchaseType or missing required fields',
        };
    }

    if (!result) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Data not found or invalid input',
      };
    }

    return result;
  }

  private calculatePrice(service: AbstractServiceEntity): number {
    let price = service.price;
    if (service.discountEnabled && service.discount > 0) {
      price -= (price / 100) * service.discount;
    }
    return price;
  }


  async stripeWebhook({ rawBody, signature }: {
    rawBody: Buffer | undefined;
    signature: string
  }) {
    let event: Stripe.Event;

    try {
      event = Stripe.webhooks.constructEvent(
        rawBody as Buffer,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      console.error(err);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        const payment_method_details = charge.payment_method_details as Stripe.Charge.PaymentMethodDetails;

        const upsertPaymentDto: UpsertPaymentDto = {
          chargeId: charge.id,
          amount: charge.amount,
          paymentIntent: charge.payment_intent as string,
          paymentMethod: charge.payment_method as string,
          last4: payment_method_details.card?.last4 as string,
          receiptUrl: charge.receipt_url as string,
          status: charge.status,
        };

        // const upsertPayment = await firstValueFrom(
        //   this.userService.send<
        //     MicroserviceResponseDto<GetPaymentResponseDto>,
        //     UpsertPaymentDto
        //   >(UserMessagePattern.upsertPayment, upsertPaymentDto),
        // );

        const upsertPayment = await this.paymentService.upsertPayment(upsertPaymentDto)

        if (
          upsertPayment.status === HttpStatus.OK ||
          upsertPayment.status === HttpStatus.CREATED
        ) {
          console.log('Payment upserted (charge.succeeded)');
        } else {
          console.error('Payment upsert failed (charge.succeeded)');
        }

        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const payment_intent = session.payment_intent as string;
        const metadata = session.metadata;

        const upsertPaymentDto: UpsertPaymentDto = {
          userId: metadata?.user_id,
          serviceId: metadata?.service_id,
          serviceName: metadata?.service_name,
          paymentIntent: payment_intent,
        }

        // const upsertPayment = await firstValueFrom(
        //   this.userService.send<
        //     MicroserviceResponseDto<GetPaymentResponseDto>,
        //     UpsertPaymentDto
        //   >(UserMessagePattern.upsertPayment, upsertPaymentDto),
        // );

        const upsertPayment=await this.paymentService.upsertPayment(upsertPaymentDto)

        if (
          upsertPayment.status === HttpStatus.OK ||
          upsertPayment.status === HttpStatus.CREATED
        ) {
          console.log('Payment upserted (checkout.session.completed)');
        } else {
          console.error('Payment upsert failed (checkout.session.completed)');
        }

        break;
      }

      // !Only for the mobile app payments
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const metadata = paymentIntent.metadata;

        // Check if all required metadata fields are present
        if (!metadata?.user_id || !metadata?.course_id || !metadata?.course_name) {
          console.error('Required metadata is missing, skipping payment upsert.');
          break;
        }

        const upsertPaymentDto: UpsertPaymentDto = {
          userId: metadata.user_id,
          serviceId: metadata.service_id,
          serviceName: metadata.service_name,
          paymentIntent: paymentIntent.id,
        };

        // const upsertPayment = await firstValueFrom(
        //   this.userService.send<
        //     MicroserviceResponseDto<GetPaymentResponseDto>,
        //     UpsertPaymentDto
        //   >(UserMessagePattern.upsertPayment, upsertPaymentDto),
        // );

        const upsertPayment = await  this.paymentService.upsertPayment(upsertPaymentDto)

        if (
          upsertPayment.status === HttpStatus.OK ||
          upsertPayment.status === HttpStatus.CREATED
        ) {
          console.log('Payment upserted (payment_intent.succeeded)');
        } else {
          console.error('Payment upsert failed (payment_intent.succeeded)');
        }

        break;
      }

      default:
        return {
          status: HttpStatus.OK,
        };
    }

    // Return a response to acknowledge receipt of the event
    return {
      status: HttpStatus.OK,
    };
  }
}

