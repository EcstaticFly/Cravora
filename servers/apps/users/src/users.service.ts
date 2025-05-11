import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  //register user service
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password } = registerDto;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      }
    })
    if(existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return { user, response };
  }

  //login user service
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = {
      email,
      password,
    };
    return user; //temp setup
  }

  //get all users service
  async getAllUsers() {
    return this.prisma.user.findMany({});
  }
}
