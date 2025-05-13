import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';

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
      throw new BadRequestException('Email already registered');
    }

    const existingPhone = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });
    if (existingPhone) {
      throw new BadRequestException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };
    const result = await this.createActivationToken(user);
    const activationCode = result.activationCode;
    const activation_token = result.token;
    // console.log(activationCode);
    await this.emailService.sendMail({
      email,
      subject: 'Cravora Activation Code',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activation_token, response };
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

  //activation user service
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;
    const newUser: {
      user: UserData;
      activationCode: string;
    } = this.jwtService.verify(activationToken, {
      secret: this.configService.get<string>('ACTIVATION_SECRET'),
    } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid Activation Code');
    }

    const { name, email, password, phone_number } = newUser.user;
    const existingEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already registered');
    }

    // const existingPhone = await this.prisma.user.findUnique({
    //   where : {
    //     phone_number,
    //   }
    // });

    // if(existingPhone) {
    //   throw new BadRequestException('Phone number already registered');
    // }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, response };
  }

  //login user service
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
      };
    }
  }

  //compare given password with hashed password
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  //get logged in user
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;

    // console.log({ user, refreshToken, accessToken });
    return { user, refreshToken, accessToken };
  }

  //logout user
  async logout(req: any) {
    try {
      req.user = null;
      req.refreshtoken = null;
      req.accesstoken = null;

      return {
        message: 'Logged out successfully',
      };
    } catch (error) {
      throw new BadRequestException('Logout failed');
    }
  }

  //get all users service
  async getAllUsers() {
    return this.prisma.user.findMany({});
  }
}
