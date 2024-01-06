import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Auth0Service {
  private AUTH0_DOMAIN: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN');
  }

  async getUserInfo(req: Request) {
    const token = req.header('Authorization');
    return await firstValueFrom(
      this.httpService.get(`${this.AUTH0_DOMAIN}userinfo`, {
        headers: { Authorization: token },
      }),
    );
  }

  getAuth0Id(req: Request) {
    const token = req.header('Authorization');
    if (!token) {
      throw new UnauthorizedException('Error retrieving user id');
    }
    const decodedToken = jwt.decode(token.split(' ')[1], { complete: true });
    if (typeof decodedToken.payload.sub === 'string') {
      return decodedToken.payload.sub.split('|')[1]; // Ex: google-oauth2|105376322685496477873
    } else {
      throw new UnauthorizedException('Error retrieving user id');
    }
  }
}
