// import { UseFilters } from "@nestjs/common";
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  ActivationResponse,
  LoginResponse,
  RegisterResponse,
} from './types/user.types';
import { ActivationDto, RegisterDto } from './dto/user.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Resolver('User')
// @UseFilters()
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill all fields!');
    }

    const { activation_token } = await this.userService.register(
      registerDto,
      context.res,
    );

    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    if (!activationDto.activationToken || !activationDto.activationCode) {
      throw new BadRequestException('Activation token and code are required!');
    }

    return await this.userService.activateUser(activationDto, context.res);
  }

  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    if (!email || !password) {
      throw new BadRequestException('Please fill all fields!');
    }
    return await this.userService.login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: Request }) {
    return await this.userService.getLoggedInUser(context.req);
  }

  @Query(() => [User])
  async getAllUsers() {
    return this.userService.getAllUsers(); //temp setup
  }
}
