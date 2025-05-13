import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const accessToken = req.headers.accesstoken as string;
    const refreshToken = req.headers.refreshtoken as string;

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to access this resource');
    }

    if (accessToken) {
      const decodedAccessToken = await this.jwtService.verify(accessToken, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      if (!decodedAccessToken) {
        throw new UnauthorizedException('Invalid access token');
      }

      await this.updateAccessToken(req);
    }
    return true;
  }

  private async updateAccessToken(req: any): Promise<void> {
    try {
      const refreshTokenData = req.headers.refreshtoken as string;
      const decodedRefreshToken = await this.jwtService.verify(
        refreshTokenData,
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        },
      );

      if (!decodedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: decodedRefreshToken.id,
        },
      });

      const accessToken = this.jwtService.sign(
        { id: user?.id },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: '30m',
        },
      );

      const refreshToken = this.jwtService.sign(
        { id: user?.id },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: '3d',
        },
      );

      req.accesstoken = accessToken;
      req.refreshtoken = refreshToken;
      req.user = user;
    } catch (error) {
      console.error('Error updating access token:', error);
      throw new UnauthorizedException(error.message);
    }
  }
}
