import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SocialLogin } from '../auth.interface';
import axios from 'axios';
// import { StripeService } from '../../stripe/stripe.service';
import { UserRepository } from '../../users/user.repository';
import { GoogleUser } from '../../users/dto/login.dto';
import { RegisterSocialDto } from '../../users/dto/register.dto';
import { UserRole } from '../../users/entities/abstract.user.entity';
import { StreamService } from '../../common/getStream/stream.service';


@Injectable()
export class GoogleService implements SocialLogin {
  constructor(
    private readonly userRepo: UserRepository,
    // private readonly stripeService: StripeService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly streamService: StreamService,

  ) { }

  async getGoogleUserInfo(token: string) {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (data.error) {
      throw new Error(data.error);
    }

    return data as GoogleUser;
  }

  async login(token: string) {
    try {
      // Get user info from google
      const googleUser = await this.getGoogleUserInfo(token);

      // Check if user exists
      /**
       * This is a workaround to check if user exists without throwing an error
       * It will handle the error gracefully and set user to null if user is not found
       */
      let user ;
      try {
        user = await this.userRepo.findOneByEmail(googleUser.email);
      } catch (error) {
        if (!(error instanceof NotFoundException)) {
          return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'An unknown error occurred',
          };
        }
      }

      // check if user account is suspended or not
      if (user && !user.active) {
        return {
          status: HttpStatus.FORBIDDEN,
          error: 'User account is suspended',
        };
      }

      if (!user) {
        const registerSocialDto: RegisterSocialDto = {
          email: googleUser.email,
          name: googleUser.name,
          profileImage: googleUser.picture,
        };
        user = await this.userRepo.registerSocial(registerSocialDto);
        await this.streamService.upsertUser(user.id, user.name ?? user.email, user.role);

        // const customer: CreateCustomerDto = {
        //   userId: user.id,
        //   email: user.email,
        //   name: user.name,
        // };

        // await this.stripeService.createCustomer(customer);
      }

      // Check the role of the user
      if (!await this.authService.checkRole(user, [UserRole.USER, UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_USER])) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized access',
        };
      }

      const authToken=await this.authService.generateToken(user);
      
      // if user exists, generate token and login
      return authToken.data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        return { status: HttpStatus.BAD_REQUEST, error: error.message };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'An unknown error occurred',
      };
    }
  }
}
