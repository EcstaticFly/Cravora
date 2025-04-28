import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    // private readonly prisma:
    private readonly configService: ConfigService,
  ) {}

  //register user service
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const user = {
      name,
      email,
      password,
    };
    return user; //temp setup
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
    const users = [
      {
        id: 1,
        name: 'Al Capone',
        email: 'al@nochance.com',
        password: "123456",
      },
    ];
    return users; //temp setup
  }
}
