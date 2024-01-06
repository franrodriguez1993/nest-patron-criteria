import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { expressJwtSecret, GetVerificationKey } from 'jwks-rsa';
import { expressjwt } from 'express-jwt';
import { promisify } from 'util';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_DOMAIN: string;
  private AUTH0_AUDIENCE: string;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN');
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE');
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @SetMetadata('PUBLIC', true)
    const isPublic = this.reflector.get('PUBLIC', context.getHandler());
    if (isPublic) {
      return true;
    }

    const req = context.getArgByIndex(0);
    const res = context.getArgByIndex(1);
    const checkJwt = promisify(
      expressjwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }) as GetVerificationKey,
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJwt(req, res);
      return true;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException('Unauthorized');
      } else {
        throw new ForbiddenException('Forbidden');
      }
    }
  }
}
