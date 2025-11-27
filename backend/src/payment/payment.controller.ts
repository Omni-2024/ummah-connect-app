import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '../users/entities/abstract.user.entity';
import { CreatePaymentDto, UpdatePaymentDto } from 'src/users/dto/user.dto';
import { PaymentStatsQueryDto } from './dto/payment-stats.dto';
import { Public } from '../auth/decorator/public.decorator';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {
    }

    @Roles([UserRole.USER, UserRole.BUSINESS_ADMIN])
    @Post()
    async create(
        @Body()
        createPaymentDto: CreatePaymentDto,
    ) {
        return await this.paymentService.createPayment(createPaymentDto);
    }

    @Roles([UserRole.USER, UserRole.BUSINESS_ADMIN])
    @Get('user')
    async getAllPaymentsByUserId(
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('userId') query?: string,
    ) {
        return await this.paymentService.getAllPaymentsByUserId({
            limit,
            offset,
            query,
        });
    }

    @Roles([UserRole.USER, UserRole.BUSINESS_ADMIN, UserRole.ROOT])
    @Get()
    async getAllPayments(
      @Query('limit') limit?: number,
      @Query('offset') offset?: number,
    ) {
      return await this.paymentService.getAllPayments({
        limit,
        offset,
      });
    }

    @Roles([UserRole.USER, UserRole.BUSINESS_ADMIN])
    @Get(':id')
    async getPaymentById(
        @Param('id') id: string,
    ){
        return await this.paymentService.getPaymentById(id);
    }


    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePaymentDto: UpdatePaymentDto,
    ){
        return await this.paymentService.updatePayment({ ...updatePaymentDto, id });
    }


    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.paymentService.deletePayment(id);
    }


    @Get('service/:serviceId')
    async getAllPaymentsByServiceId(
        @Param('serviceId') serviceId: string,
    ) {
        return await this.paymentService.getAllPaymentsByServiceId(serviceId);
    }


    @Roles([UserRole.USER, UserRole.BUSINESS_ADMIN])
    @Get('single/payment')
    async getAllPaymentsByServiceIdAndUserId(
        @Query('userId') userId: string,
        @Query('serviceId') serviceId: string,
    ) {
        return await this.paymentService.getAllPaymentsByServiceIdAndUserId(
           serviceId,
           userId,
        );
    }

  @Roles([UserRole.BUSINESS_ADMIN, UserRole.ADMIN, UserRole.ROOT])    @Get('stats/summary')
    async getPaymentStats(@Query() query: PaymentStatsQueryDto) {
      if (query.providerId) {
        return this.paymentService.getProviderPaymentStats(query.providerId, query);
      }
      return this.paymentService.getGlobalPaymentStats(query);
    }
}



