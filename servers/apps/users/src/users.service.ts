import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  //register user service
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    const existingEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const existingPhone = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });
    if (existingPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        name,
        email,
        password: hashedPassword,
        phone_number,
      };
      const activationToken = await this.createActivationToken(user)
      const activationCode = activationToken.activationCode;
      // console.log(activationCode);
      await this.emailService.sendMail({
        email,
        subject: 'Cravora Activation Code',
        template: './activation-mail',
        name,
        activationCode,
      })
      

    return { user, response };
  }

  //create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
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
