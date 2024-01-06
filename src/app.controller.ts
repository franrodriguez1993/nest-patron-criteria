import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthorizationGuard } from './App/shared/guards/authorization.guard';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/public')
  getPublic(): string {
    return this.appService.getPublic();
  }

  @UseGuards(AuthorizationGuard)
  @Get('/private')
  getPrivate(@Req() req: Request) {
    return this.appService.getPrivate(req);
  }
}
