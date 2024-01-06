import { Injectable } from '@nestjs/common';
import { Auth0Service } from './App/shared/auth0.service';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(private readonly auth0Service: Auth0Service) {}
  getHello(): string {
    return 'Hello World!';
  }

  getPublic(): string {
    return 'This is a public endpoint';
  }

  async getPrivate(req: Request): Promise<string> {
    const info = await this.auth0Service.getUserInfo(req);
    console.log(info);
    return 'This is a private endpoint';
  }
}
