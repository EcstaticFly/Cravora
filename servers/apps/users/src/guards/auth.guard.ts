import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req, res } = gqlContext.getContext();

    const accessToken = req.headers.accesstoken as string;
    const refreshToken = req.headers.refreshtoken as string;

    if (
      !accessToken ||
      !refreshToken ||
      accessToken === 'undefined' ||
      accessToken === undefined ||
      accessToken === 'null' ||
      accessToken === null ||
      accessToken === '' ||
      refreshToken === 'undefined' ||
      refreshToken === undefined ||
      refreshToken === 'null' ||
      refreshToken === null ||
      refreshToken === ''
    ) {
      throw new UnauthorizedException('Authentication tokens are missing.');
    }

    try {
      const decodedAccessToken = this.jwtService.verify(accessToken, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decodedAccessToken.id },
      });
      if (!user) {
        throw new UnauthorizedException('User not found.');
      }
      req.user = user;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        try {
          const decodedRefreshToken = this.jwtService.verify(refreshToken, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          });

          const user = await this.prisma.user.findUnique({
            where: { id: decodedRefreshToken.id },
          });
          if (!user) throw new Error(); 

          const newRefreshToken = this.jwtService.sign(
            { id: user.id },
            {
              secret: this.configService.get('REFRESH_TOKEN_SECRET'),
              expiresIn: '7d',
            },
          );

          const newAccessToken = this.jwtService.sign(
            { id: user.id },
            {
              secret: this.configService.get('ACCESS_TOKEN_SECRET'),
              expiresIn: '5m',
            },
          );

          res.setHeader('x-new-accesstoken', newAccessToken);
          res.setHeader('x-new-refreshtoken', newRefreshToken);

          req.user = user;
        } catch (refreshError) {
          throw new UnauthorizedException(
            'Session expired. Please log in again.',
          );
        }
      } else {
        throw new UnauthorizedException('Invalid access token.');
      }
    }

    return true;
  }
}
